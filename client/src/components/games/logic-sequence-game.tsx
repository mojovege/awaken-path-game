import React, { useState, useEffect } from 'react';
import { RELIGIOUS_CONTENT, GameDifficulty, calculateStarRating, GAME_TYPES } from '@/lib/game-config';
import BackgroundMusic from '../audio/background-music';

interface LogicSequenceGameProps {
  religion: string;
  difficulty: GameDifficulty;
  onGameComplete: (score: number, stars: number) => void;
}

interface SequenceQuestion {
  id: number;
  sequence: string[];
  options: string[];
  correctAnswer: string;
  userAnswer?: string;
}

export default function LogicSequenceGame({ religion, difficulty, onGameComplete }: LogicSequenceGameProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [questions, setQuestions] = useState<SequenceQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isComplete, setIsComplete] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const religionData = RELIGIOUS_CONTENT[religion as keyof typeof RELIGIOUS_CONTENT];
  const maxScore = GAME_TYPES['logic-sequence'].getMaxScore(difficulty);
  const questionCount = difficulty.chapter + 2; // 3-7題

  // 根據宗教生成不同的序列模式
  const generateSequencePatterns = () => {
    const patterns = {
      buddhism: [
        {
          base: ['南無', '阿彌陀', '佛', '南無'],
          pattern: 'repeat',
          next: '阿彌陀'
        },
        {
          base: ['慈', '悲', '喜', '捨'],
          pattern: 'cycle',
          next: '慈'
        },
        {
          base: ['一', '二', '三', '四'],
          pattern: 'number',
          next: '五'
        },
        {
          base: ['戒', '定', '慧', '戒'],
          pattern: 'wisdom',
          next: '定'
        }
      ],
      taoism: [
        {
          base: ['道', '德', '經', '道'],
          pattern: 'repeat',
          next: '德'
        },
        {
          base: ['陰', '陽', '陰', '陽'],
          pattern: 'alternate',
          next: '陰'
        },
        {
          base: ['無', '極', '太', '極'],
          pattern: 'progression',
          next: '兩'
        },
        {
          base: ['天', '地', '人', '天'],
          pattern: 'cycle',
          next: '地'
        }
      ],
      mazu: [
        {
          base: ['媽', '祖', '保', '佑'],
          pattern: 'sequence',
          next: '平'
        },
        {
          base: ['風', '調', '雨', '順'],
          pattern: 'blessing',
          next: '國'
        },
        {
          base: ['東', '南', '西', '北'],
          pattern: 'direction',
          next: '中'
        },
        {
          base: ['春', '夏', '秋', '冬'],
          pattern: 'season',
          next: '春'
        }
      ]
    };

    return patterns[religion as keyof typeof patterns] || patterns.buddhism;
  };

  useEffect(() => {
    generateQuestions();
  }, [religion, difficulty]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameStarted && timeLeft > 0 && !isComplete) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (gameStarted && timeLeft === 0 && !isComplete) {
      handleTimeUp();
    }
    
    return () => clearTimeout(timer);
  }, [gameStarted, timeLeft, isComplete]);

  const generateQuestions = () => {
    const patterns = generateSequencePatterns();
    const newQuestions: SequenceQuestion[] = [];

    for (let i = 0; i < questionCount; i++) {
      const pattern = patterns[i % patterns.length];
      const wrongOptions = generateWrongOptions(pattern.next);
      
      // 確保正確答案在選項中
      const allOptions = [pattern.next, ...wrongOptions].slice(0, 4);
      
      // 洗牌選項
      for (let j = allOptions.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [allOptions[j], allOptions[k]] = [allOptions[k], allOptions[j]];
      }

      newQuestions.push({
        id: i,
        sequence: [...pattern.base],
        options: allOptions,
        correctAnswer: pattern.next
      });
    }

    setQuestions(newQuestions);
  };

  const generateWrongOptions = (correctAnswer: string): string[] => {
    const allOptions = {
      buddhism: ['菩薩', '法', '僧', '蓮', '花', '光', '明', '心', '性', '空'],
      taoism: ['氣', '神', '仙', '丹', '劍', '符', '咒', '靈', '妙', '玄'],
      mazu: ['安', '康', '福', '壽', '吉', '祥', '如', '意', '圓', '滿']
    };

    const options = allOptions[religion as keyof typeof allOptions] || allOptions.buddhism;
    return options.filter(opt => opt !== correctAnswer).slice(0, 3);
  };

  const startGame = () => {
    setGameStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(30);
    setIsComplete(false);
    setShowResult(false);
    generateQuestions();
  };

  const handleAnswer = (answer: string) => {
    if (isComplete || showResult) return;

    const question = questions[currentQuestion];
    const isCorrect = answer === question.correctAnswer;
    
    // 更新問題答案
    setQuestions(prev => prev.map((q, index) => 
      index === currentQuestion ? { ...q, userAnswer: answer } : q
    ));

    if (isCorrect) {
      setScore(prev => prev + 25);
    }

    setShowResult(true);

    // 2秒後進入下一題或結束
    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(prev => prev + 1);
        setShowResult(false);
        setTimeLeft(30); // 重置時間
      } else {
        completeGame();
      }
    }, 2000);
  };

  const handleTimeUp = () => {
    if (showResult) return;
    
    // 時間到，當作錯誤答案
    setQuestions(prev => prev.map((q, index) => 
      index === currentQuestion ? { ...q, userAnswer: '' } : q
    ));

    setShowResult(true);

    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(prev => prev + 1);
        setShowResult(false);
        setTimeLeft(30);
      } else {
        completeGame();
      }
    }, 2000);
  };

  const completeGame = () => {
    setIsComplete(true);
    const stars = calculateStarRating(score, maxScore);
    setTimeout(() => onGameComplete(score, stars), 1000);
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <div className="min-h-screen bg-warm-bg p-6">
      <BackgroundMusic 
        audioType="meditation" 
        isPlaying={gameStarted && !isComplete} 
      />
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-elderly-2xl font-bold text-warm-gold mb-4">
            {religionData.name}智慧序列
          </h2>
          
          {!gameStarted && (
            <div className="mb-6">
              <p className="text-elderly-lg text-warm-gray-600 mb-4">
                觀察序列規律，選擇下一個元素
              </p>
              <p className="text-elderly-base text-warm-gray-500">
                題目數：{questionCount}題 | 每題時間：30秒 | 每題得分：25分
              </p>
            </div>
          )}

          {gameStarted && !isComplete && (
            <div className="mb-6">
              <p className="text-elderly-lg text-blue-600 font-bold">
                第{currentQuestion + 1}/{questionCount}題 | 時間：{timeLeft}秒 | 得分：{score} / {maxScore}
              </p>
            </div>
          )}
        </div>

        {/* 題目區域 */}
        {gameStarted && !isComplete && getCurrentQuestion() && (
          <div className="mb-8">
            {/* 序列顯示 */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-md">
              <h3 className="text-elderly-lg font-bold text-center mb-4 text-warm-gray-800">
                找出序列規律，選擇下一個元素：
              </h3>
              
              <div className="flex items-center justify-center space-x-4 mb-4">
                {getCurrentQuestion().sequence.map((item, index) => (
                  <div
                    key={index}
                    className="w-16 h-16 bg-warm-gold text-white rounded-lg flex items-center justify-center text-elderly-lg font-bold"
                  >
                    {item}
                  </div>
                ))}
                
                <div className="text-elderly-2xl text-warm-gray-600">→</div>
                
                <div className="w-16 h-16 bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-elderly-lg">
                  ?
                </div>
              </div>
            </div>

            {/* 選項 */}
            <div className="grid grid-cols-2 gap-4">
              {getCurrentQuestion().options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={showResult}
                  className={`
                    p-4 rounded-lg border-2 text-elderly-lg font-bold transition-all duration-200
                    ${showResult
                      ? option === getCurrentQuestion().correctAnswer
                        ? 'bg-green-100 border-green-400 text-green-800'
                        : option === getCurrentQuestion().userAnswer
                          ? 'bg-red-100 border-red-400 text-red-800'
                          : 'bg-gray-100 border-gray-300 text-gray-500'
                      : 'bg-white border-warm-gray-300 hover:border-warm-gold hover:bg-warm-gold hover:text-white'
                    }
                  `}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* 結果顯示 */}
            {showResult && (
              <div className="text-center mt-6">
                <p className={`text-elderly-lg font-bold ${
                  getCurrentQuestion().userAnswer === getCurrentQuestion().correctAnswer
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {getCurrentQuestion().userAnswer === getCurrentQuestion().correctAnswer
                    ? '✓ 正確！'
                    : `✗ 錯誤，正確答案是：${getCurrentQuestion().correctAnswer}`
                  }
                </p>
              </div>
            )}
          </div>
        )}

        <div className="text-center">
          {!gameStarted ? (
            <button
              onClick={startGame}
              className="bg-warm-gold text-white px-8 py-4 rounded-lg text-elderly-lg font-bold hover:bg-yellow-600 transition-colors"
            >
              開始挑戰
            </button>
          ) : isComplete ? (
            <div>
              <p className="text-elderly-lg text-green-600 font-bold mb-4">
                挑戰完成！得分：{score} / {maxScore}分
              </p>
              <button
                onClick={startGame}
                className="bg-warm-gold text-white px-8 py-4 rounded-lg text-elderly-lg font-bold hover:bg-yellow-600 transition-colors"
              >
                再次挑戰
              </button>
            </div>
          ) : showResult ? (
            <p className="text-elderly-base text-warm-gray-600">
              正在進入下一題...
            </p>
          ) : (
            <p className="text-elderly-base text-warm-gray-600">
              觀察序列規律，選擇最合適的下一個元素
            </p>
          )}
        </div>
      </div>
    </div>
  );
}