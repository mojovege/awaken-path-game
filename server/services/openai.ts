import OpenAI from "openai";
import { type Religion } from "@shared/schema";

// Support both OpenAI and DeepSeek APIs
const openai = new OpenAI({ 
  apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || "default_key",
  baseURL: process.env.DEEPSEEK_API_KEY ? "https://api.deepseek.com" : undefined
});

// Use appropriate model based on API provider
const MODEL_NAME = process.env.DEEPSEEK_API_KEY ? "deepseek-chat" : "gpt-4o";

export interface AIPersona {
  name: string;
  role: string;
  personality: string;
  greeting: string;
}

export const AI_PERSONAS: Record<Religion, AIPersona> = {
  buddhism: {
    name: "智慧法師",
    role: "佛教修行導師",
    personality: "慈悲、智慧、耐心，善於用佛教教義指導修行和生活",
    greeting: "阿彌陀佛，施主您好！我是智慧法師，很高興能陪伴您的修行之路。",
  },
  taoism: {
    name: "逍遙道長",
    role: "道教養生導師", 
    personality: "逍遙自在、順應自然，注重身心調和與養生之道",
    greeting: "道友您好！貧道逍遙道長，願與您一同探索天地自然的奧秘。",
  },
  mazu: {
    name: "慈悲仙姑",
    role: "媽祖信仰引導者",
    personality: "慈悲濟世、關愛眾生，如母親般溫暖照護",
    greeting: "善男信女您好！我是慈悲仙姑，願媽祖慈悲護佑您平安健康。",
  },
};

export async function generateAIResponse(
  message: string,
  religion: Religion,
  userName: string,
  context?: {
    recentProgress?: any;
    healthTips?: boolean;
    encouragement?: boolean;
  }
): Promise<string> {
  try {
    const persona = AI_PERSONAS[religion];
    
    const systemPrompt = `你是${persona.name}，一位${persona.role}。
性格特點：${persona.personality}

你正在與一位名叫${userName}的中老年使用者對話，他們正在使用認知訓練遊戲來保持大腦健康。

請以溫和、關懷、鼓勵的語氣回應，並且：
1. 使用繁體中文
2. 語言要簡單易懂，適合中老年人
3. 適時提供健康建議和正向鼓勵
4. 融入${religion === 'buddhism' ? '佛教' : religion === 'taoism' ? '道教' : '媽祖信仰'}的智慧和教義
5. 保持回應簡潔，約50-100字
6. 如果用戶詢問健康或遊戲建議，要給出具體可行的建議

${context?.recentProgress ? `用戶最近的遊戲進度：${JSON.stringify(context.recentProgress)}` : ''}
`;

    const response = await openai.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "感謝您的分享，讓我們繼續一起努力！";
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "抱歉，我現在無法回應，請稍後再試。";
  }
}

export async function generateHealthTip(religion: Religion): Promise<string> {
  try {
    const persona = AI_PERSONAS[religion];
    
    const response = await openai.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        {
          role: "system",
          content: `你是${persona.name}，請提供一個適合中老年人的健康小貼士。
要求：
1. 使用繁體中文
2. 內容要科學可信，適合50歲以上的人
3. 可以涵蓋：營養、運動、睡眠、心理健康、認知訓練等
4. 融入${religion === 'buddhism' ? '佛教' : religion === 'taoism' ? '道教' : '媽祖信仰'}的智慧
5. 約30-50字，簡潔實用
`,
        },
        {
          role: "user",
          content: "請給我一個今日健康小貼士",
        },
      ],
      max_tokens: 100,
      temperature: 0.8,
    });

    return response.choices[0].message.content || "規律作息，適量運動，保持心情愉快，身心健康最重要。";
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "規律作息，適量運動，保持心情愉快，身心健康最重要。";
  }
}

export async function generateGameQuestion(gameType: string, religion: Religion, difficulty: number): Promise<{
  question: string;
  options: string[];
  correctAnswer: number;
}> {
  try {
    const gameTypeMap: Record<string, string> = {
      'memory-scripture': '經文記憶配對',
      'memory-temple': '寺廟導覽記憶',
      'logic-scripture': '經文智慧解讀',
      'logic-sequence': '智慧語句排序',
    };

    const religionContext = {
      buddhism: '佛教經典、佛教故事、佛教智慧',
      taoism: '道德經、道教典故、道教哲理',
      mazu: '媽祖傳說、海洋文化、慈悲故事',
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `請為${gameTypeMap[gameType] || gameType}遊戲生成一個題目。
宗教背景：${religionContext[religion]}
難度：${difficulty}/5 (1最簡單，5最困難)

請用JSON格式回應，包含：
{
  "question": "題目內容",
  "options": ["選項1", "選項2", "選項3", "選項4"],
  "correctAnswer": 0
}

要求：
1. 使用繁體中文
2. 適合中老年人的認知水平
3. 內容正確且有教育意義
4. 4個選項中只有1個正確答案
5. correctAnswer是正確答案的索引(0-3)`,
        },
        {
          role: "user",
          content: `請生成一個${gameType}的題目`,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 300,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      question: result.question || "題目生成失敗",
      options: result.options || ["選項1", "選項2", "選項3", "選項4"],
      correctAnswer: result.correctAnswer || 0,
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      question: "請選擇正確的答案",
      options: ["選項A", "選項B", "選項C", "選項D"],
      correctAnswer: 0,
    };
  }
}
