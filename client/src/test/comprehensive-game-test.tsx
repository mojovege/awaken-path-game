// 完整遊戲測試系統
import React, { useState } from 'react';
import { RELIGIOUS_CONTENT, GAME_DIFFICULTIES, GAME_TYPES } from '@/lib/game-config';
import { SoundEffects } from '@/components/audio/sound-effects';

const ComprehensiveGameTest = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const emoji = type === 'success' ? '✅' : type === 'error' ? '❌' : '📋';
    const timestamp = new Date().toLocaleTimeString();
    setTestResults(prev => [...prev, `${timestamp} ${emoji} ${message}`]);
  };

  const testReligionContent = () => {
    addResult('開始測試宗教內容完整性...', 'info');
    
    Object.entries(RELIGIOUS_CONTENT).forEach(([key, content]) => {
      if (!content.name || !content.emoji) {
        addResult(`${key} 缺少基本信息`, 'error');
        return;
      }
      
      if (content.buildings.length !== 6 || content.buildingEmojis.length !== 6) {
        addResult(`${content.name} 建築數量不正確 (期望6個，實際${content.buildings.length}個)`, 'error');
        return;
      }
      
      if (content.concepts.length !== 6) {
        addResult(`${content.name} 概念數量不正確 (期望6個，實際${content.concepts.length}個)`, 'error');
        return;
      }
      
      // 檢查概念配對完整性
      let hasValidConcepts = true;
      content.concepts.forEach((concept, index) => {
        if (!concept.text || !concept.match) {
          addResult(`${content.name} 第${index + 1}個概念缺少文本或配對`, 'error');
          hasValidConcepts = false;
        }
      });
      
      if (hasValidConcepts) {
        addResult(`${content.name} 內容完整 ✓`, 'success');
      }
    });
  };

  const testGameLogic = () => {
    addResult('開始測試遊戲邏輯配置...', 'info');
    
    // 測試難度配置
    if (GAME_DIFFICULTIES.length !== 5) {
      addResult(`難度等級數量錯誤 (期望5個，實際${GAME_DIFFICULTIES.length}個)`, 'error');
      return;
    }
    
    GAME_DIFFICULTIES.forEach((difficulty, index) => {
      if (difficulty.chapter !== index + 1) {
        addResult(`第${index + 1}個難度等級章節編號錯誤`, 'error');
      }
      
      if (difficulty.memoryTime < 4 || difficulty.memoryTime > 10) {
        addResult(`第${index + 1}章記憶時間異常 (${difficulty.memoryTime}s)`, 'error');
      }
      
      if (difficulty.reactionWindow < 300 || difficulty.reactionWindow > 1000) {
        addResult(`第${index + 1}章反應窗口異常 (${difficulty.reactionWindow}ms)`, 'error');
      }
    });
    
    // 測試遊戲類型配置
    const expectedGameTypes = [
      'memory-scripture', 'memory-temple',
      'reaction-rhythm', 'reaction-lighting',
      'logic-scripture', 'logic-sequence'
    ];
    
    expectedGameTypes.forEach(gameType => {
      if (!GAME_TYPES[gameType]) {
        addResult(`遊戲類型 ${gameType} 未定義`, 'error');
        return;
      }
      
      const game = GAME_TYPES[gameType];
      
      if (!game.name || !game.category || !game.audioType) {
        addResult(`遊戲類型 ${gameType} 配置不完整`, 'error');
        return;
      }
      
      // 測試分數計算
      try {
        const testDifficulty = GAME_DIFFICULTIES[0];
        const maxScore = game.getMaxScore(testDifficulty);
        const duration = game.getDuration(testDifficulty);
        
        if (maxScore <= 0) {
          addResult(`${game.name} 最高分數計算錯誤 (${maxScore})`, 'error');
        } else if (duration < 0) {
          addResult(`${game.name} 遊戲時長計算錯誤 (${duration}s)`, 'error');
        } else {
          addResult(`${game.name} 配置正確 ✓`, 'success');
        }
      } catch (error) {
        addResult(`${game.name} 函數計算出錯: ${error}`, 'error');
      }
    });
  };

  const testMemoryGameLogic = () => {
    addResult('開始測試記憶遊戲配對邏輯...', 'info');
    
    Object.entries(RELIGIOUS_CONTENT).forEach(([religion, content]) => {
      // 模擬卡片生成邏輯
      const concepts = content.concepts.slice(0, 3); // 模擬第一章難度
      const cards: any[] = [];
      
      concepts.forEach((concept, index) => {
        cards.push({
          id: cards.length,
          text: concept.text,
          type: 'concept',
          pairId: index,
          isFlipped: false,
          isMatched: false
        });
        cards.push({
          id: cards.length,
          text: concept.match,
          type: 'meaning',
          pairId: index,
          isFlipped: false,
          isMatched: false
        });
      });
      
      // 測試配對邏輯
      let pairTestsPassed = 0;
      for (let i = 0; i < cards.length; i++) {
        for (let j = i + 1; j < cards.length; j++) {
          const card1 = cards[i];
          const card2 = cards[j];
          
          const shouldMatch = card1.pairId === card2.pairId && card1.type !== card2.type;
          const originalConcept = concepts.find(c => c.text === card1.text || c.match === card1.text);
          const targetConcept = concepts.find(c => c.text === card2.text || c.match === card2.text);
          
          if (shouldMatch && originalConcept && targetConcept && originalConcept === targetConcept) {
            pairTestsPassed++;
          }
        }
      }
      
      if (pairTestsPassed === concepts.length) {
        addResult(`${content.name} 記憶配對邏輯正確 ✓`, 'success');
      } else {
        addResult(`${content.name} 記憶配對邏輯錯誤 (預期${concepts.length}對，通過${pairTestsPassed}對)`, 'error');
      }
    });
  };

  const testAudioSystem = async () => {
    addResult('開始測試音效系統...', 'info');
    
    try {
      // 測試系統初始化
      const initResult = await SoundEffects.testAudio();
      if (!initResult) {
        addResult('音效系統初始化失敗', 'error');
        return;
      }
      addResult('音效系統初始化成功 ✓', 'success');
      
      // 測試各種音效類型
      const soundTypes = ['beat', 'success', 'error'] as const;
      const religions = ['buddhism', 'taoism', 'mazu'];
      
      for (const religion of religions) {
        for (const soundType of soundTypes) {
          try {
            const result = await SoundEffects.playSound(soundType, religion);
            if (result) {
              addResult(`${religion} ${soundType} 音效播放成功 ✓`, 'success');
            } else {
              addResult(`${religion} ${soundType} 音效播放失敗`, 'error');
            }
            
            // 添加延遲避免音效重疊
            await new Promise(resolve => setTimeout(resolve, 100));
          } catch (error) {
            addResult(`${religion} ${soundType} 音效測試出錯: ${error}`, 'error');
          }
        }
      }
    } catch (error) {
      addResult(`音效系統測試出錯: ${error}`, 'error');
    }
  };

  const runFullTest = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    addResult('開始全面測試...', 'info');
    
    // 依序執行各項測試
    testReligionContent();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    testGameLogic();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    testMemoryGameLogic();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testAudioSystem();
    
    addResult('所有測試完成！', 'info');
    setIsRunning(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">覺悟之路遊戲完整測試</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 測試控制 */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold">測試項目</h3>
          
          <button 
            onClick={testReligionContent}
            disabled={isRunning}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            測試宗教內容完整性
          </button>
          
          <button 
            onClick={testGameLogic}
            disabled={isRunning}
            className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            測試遊戲邏輯配置
          </button>
          
          <button 
            onClick={testMemoryGameLogic}
            disabled={isRunning}
            className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:bg-gray-400"
          >
            測試記憶配對邏輯
          </button>
          
          <button 
            onClick={testAudioSystem}
            disabled={isRunning}
            className="w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:bg-gray-400"
          >
            測試音效系統
          </button>
          
          <button 
            onClick={runFullTest}
            disabled={isRunning}
            className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400 font-bold"
          >
            {isRunning ? '測試進行中...' : '執行完整測試'}
          </button>
          
          <button 
            onClick={clearResults}
            disabled={isRunning}
            className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-400"
          >
            清除結果
          </button>
        </div>
        
        {/* 測試結果 */}
        <div>
          <h3 className="text-lg font-bold mb-3">測試結果</h3>
          <div className="bg-gray-100 p-4 rounded h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-500">點擊測試按鈕查看結果</p>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="text-sm mb-1 font-mono">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* 測試統計 */}
      <div className="mt-6 p-4 bg-blue-50 rounded">
        <h3 className="font-bold mb-2">測試統計</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-bold">成功：</span>
            {testResults.filter(r => r.includes('✅')).length}
          </div>
          <div>
            <span className="font-bold">失敗：</span>
            {testResults.filter(r => r.includes('❌')).length}
          </div>
          <div>
            <span className="font-bold">總數：</span>
            {testResults.length}
          </div>
        </div>
      </div>
      
      {/* 說明 */}
      <div className="mt-4 p-4 bg-yellow-50 rounded">
        <h3 className="font-bold mb-2">測試說明</h3>
        <ul className="text-sm space-y-1">
          <li>• 宗教內容完整性：檢查三個宗教的建築、概念配對數據完整性</li>
          <li>• 遊戲邏輯配置：驗證難度設定、遊戲類型、分數計算等配置</li>
          <li>• 記憶配對邏輯：測試卡片生成和配對驗證的正確性</li>
          <li>• 音效系統：測試所有宗教音效的初始化和播放功能</li>
          <li>• 完整測試會按順序執行所有測試項目並統計結果</li>
        </ul>
      </div>
    </div>
  );
};

export default ComprehensiveGameTest;