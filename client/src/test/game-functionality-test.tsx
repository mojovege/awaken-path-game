import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

// 功能測試清單
const testCategories = [
  {
    category: '核心需求',
    tests: [
      { id: 'chapters', name: '5個章節系統', description: '初心啟蒙→勤修精進→智慧開悟→深度修行→圓滿境界' },
      { id: 'games-per-chapter', name: '每章6種遊戲', description: '記憶經文、記憶導覽、節奏跟隨、祈福點燈、經典排序、智慧序列' },
      { id: 'religions', name: '3種宗教支持', description: '佛教、道教、媽祖信仰' },
      { id: 'difficulty', name: '漸進式難度', description: '記憶時間遞減、反應窗口縮短、元素數量增加' },
    ]
  },
  {
    category: '記憶訓練遊戲',
    tests: [
      { id: 'scripture-study', name: '經文學習階段', description: '遊戲前顯示概念-含義配對關係' },
      { id: 'scripture-pairing', name: '配對機制', description: '翻開卡片配對，每對20分' },
      { id: 'temple-memory', name: '建築記憶', description: '記住目標建築，重新排列後找出' },
      { id: 'temple-scoring', name: '記憶計分', description: '正確+20分，錯誤-5分' },
    ]
  },
  {
    category: '反應訓練遊戲',
    tests: [
      { id: 'rhythm-beats', name: '節拍生成', description: '根據難度生成節拍序列' },
      { id: 'rhythm-timing', name: '節奏時機', description: '反應窗口內點擊得分' },
      { id: 'lighting-sequence', name: '點燈順序', description: '觀看順序後重現' },
      { id: 'lighting-accuracy', name: '點燈準確', description: '正確點擊+15分，錯誤-5分' },
    ]
  },
  {
    category: '邏輯訓練遊戲',
    tests: [
      { id: 'scripture-sorting', name: '經典排序', description: '拖拽排列正確順序' },
      { id: 'scripture-percentage', name: '百分比計分', description: '正確率×最高分' },
      { id: 'sequence-pattern', name: '序列規律', description: '觀察規律選擇下一個' },
      { id: 'sequence-questions', name: '多題挑戰', description: '每題25分，30秒限時' },
    ]
  },
  {
    category: '提示系統',
    tests: [
      { id: 'hint-buttons', name: '提示按鈕', description: '所有遊戲都有"顯示提示"按鈕' },
      { id: 'hint-memory', name: '記憶提示', description: '顯示配對關係或目標建築' },
      { id: 'hint-reaction', name: '反應提示', description: '顯示時機窗口或正確順序' },
      { id: 'hint-logic', name: '邏輯提示', description: '顯示正確答案和解釋' },
    ]
  },
  {
    category: '宗教內容',
    tests: [
      { id: 'buddhism-content', name: '佛教內容', description: '大雄寶殿、慈悲智慧、禪定音效' },
      { id: 'taoism-content', name: '道教內容', description: '三清殿、陰陽道德、太極音效' },
      { id: 'mazu-content', name: '媽祖內容', description: '天后宮、護佑平安、海浪音效' },
      { id: 'religious-audio', name: '宗教音效', description: '木魚、鼓聲、鐘聲等' },
    ]
  },
  {
    category: '計分系統',
    tests: [
      { id: 'score-calculation', name: '分數計算', description: '各遊戲正確計分' },
      { id: 'star-rating', name: '星級評分', description: '85%=3星，60%=2星，30%=1星' },
      { id: 'max-scores', name: '最高分數', description: '根據難度動態計算' },
      { id: 'score-logging', name: '計分日誌', description: '控制台顯示詳細計分信息' },
    ]
  },
  {
    category: '故事系統',
    tests: [
      { id: 'story-chapters', name: '章節故事', description: '每章有獨特故事內容' },
      { id: 'story-religion', name: '宗教故事', description: '3種宗教各有專屬故事線' },
      { id: 'story-progress', name: '故事進度', description: '完成遊戲解鎖故事' },
      { id: 'chapter-unlock', name: '章節解鎖', description: '星星數量達標解鎖新章節' },
    ]
  }
];

export default function GameFunctionalityTest() {
  const [testResults, setTestResults] = useState<Record<string, 'pass' | 'fail' | 'pending'>>({});
  
  const markTest = (testId: string, result: 'pass' | 'fail' | 'pending') => {
    setTestResults(prev => ({ ...prev, [testId]: result }));
  };

  const getTestStatus = (testId: string) => {
    return testResults[testId] || 'pending';
  };

  const getStatusIcon = (status: 'pass' | 'fail' | 'pending') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const calculateProgress = () => {
    const total = testCategories.reduce((sum, cat) => sum + cat.tests.length, 0);
    const passed = Object.values(testResults).filter(r => r === 'pass').length;
    return Math.round((passed / total) * 100);
  };

  return (
    <div className="min-h-screen bg-warm-bg p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-warm-gold mb-4">
            覺悟之路 - 功能測試檢查表
          </h1>
          <div className="bg-white rounded-lg p-4 inline-block">
            <p className="text-lg font-semibold mb-2">測試進度：{calculateProgress()}%</p>
            <div className="w-64 bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {testCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="shadow-lg">
              <CardHeader className="bg-warm-cream">
                <CardTitle className="text-xl text-warm-brown">
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {category.tests.map((test) => {
                    const status = getTestStatus(test.id);
                    return (
                      <div key={test.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(status)}
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-semibold text-lg">{test.name}</h3>
                          <p className="text-gray-600 text-sm mb-2">{test.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={status === 'pass' ? 'default' : 'outline'}
                            className={status === 'pass' ? 'bg-green-500 hover:bg-green-600' : ''}
                            onClick={() => markTest(test.id, 'pass')}
                          >
                            通過
                          </Button>
                          <Button
                            size="sm"
                            variant={status === 'fail' ? 'default' : 'outline'}
                            className={status === 'fail' ? 'bg-red-500 hover:bg-red-600' : ''}
                            onClick={() => markTest(test.id, 'fail')}
                          >
                            失敗
                          </Button>
                          <Button
                            size="sm"
                            variant={status === 'pending' ? 'default' : 'outline'}
                            className={status === 'pending' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                            onClick={() => markTest(test.id, 'pending')}
                          >
                            待測
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Card className="inline-block">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">測試指引</h2>
              <div className="text-left space-y-2 text-sm">
                <p>1. 選擇宗教：佛教、道教、媽祖信仰</p>
                <p>2. 進入章節：測試5個章節是否都可進入</p>
                <p>3. 測試6種遊戲：每章包含所有遊戲類型</p>
                <p>4. 檢查學習階段：記憶遊戲前有學習時間</p>
                <p>5. 測試提示功能：點擊"顯示提示"按鈕</p>
                <p>6. 驗證計分：查看控制台計分日誌</p>
                <p>7. 檢查音效：不同宗教有不同音效</p>
                <p>8. 測試難度遞增：後續章節更困難</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}