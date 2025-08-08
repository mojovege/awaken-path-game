// 音效調試工具
import React, { useState } from 'react';
import { SoundEffects } from '@/components/audio/sound-effects';

const AudioDebug = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testSystemInit = async () => {
    addResult('🧪 測試音效系統初始化...');
    try {
      const success = await SoundEffects.testAudio();
      addResult(success ? '✅ 音效系統初始化成功' : '❌ 音效系統初始化失敗');
    } catch (error) {
      addResult(`❌ 測試出錯: ${error}`);
    }
  };

  const testSingleBeat = async (religion: string) => {
    addResult(`🥁 測試${religion}節拍音效...`);
    try {
      const success = await SoundEffects.playSound('beat', religion);
      addResult(success ? `✅ ${religion}節拍播放成功` : `❌ ${religion}節拍播放失敗`);
    } catch (error) {
      addResult(`❌ ${religion}節拍測試出錯: ${error}`);
    }
  };

  const testRhythmSequence = async () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    addResult('🎼 測試節拍序列...');
    
    const beats = [
      { time: 0, religion: 'buddhism' },
      { time: 0.5, religion: 'taoism' },
      { time: 1.0, religion: 'mazu' },
      { time: 1.5, religion: 'buddhism' },
      { time: 2.0, religion: 'taoism' }
    ];
    
    for (const beat of beats) {
      setTimeout(async () => {
        try {
          const success = await SoundEffects.playSound('beat', beat.religion);
          addResult(`${success ? '✅' : '❌'} ${beat.time}s: ${beat.religion}節拍`);
        } catch (error) {
          addResult(`❌ ${beat.time}s: ${beat.religion}節拍出錯 - ${error}`);
        }
      }, beat.time * 1000);
    }
    
    setTimeout(() => {
      setIsPlaying(false);
      addResult('🏁 節拍序列測試完成');
    }, 3000);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const testAudioContext = async () => {
    addResult('🔧 檢查AudioContext狀態...');
    
    try {
      if (window.AudioContext || (window as any).webkitAudioContext) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const testContext = new AudioContextClass();
        
        addResult(`📊 AudioContext狀態: ${testContext.state}`);
        addResult(`🔊 採樣率: ${testContext.sampleRate}Hz`);
        addResult(`⏰ 當前時間: ${testContext.currentTime.toFixed(3)}s`);
        
        if (testContext.state === 'suspended') {
          addResult('🔄 嘗試恢復AudioContext...');
          await testContext.resume();
          addResult(`✅ AudioContext恢復後狀態: ${testContext.state}`);
        }
        
        testContext.close();
        addResult('✅ AudioContext測試完成');
      } else {
        addResult('❌ 瀏覽器不支持AudioContext');
      }
    } catch (error) {
      addResult(`❌ AudioContext測試失敗: ${error}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">音效調試工具</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 測試按鈕 */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold">測試功能</h3>
          
          <button 
            onClick={testSystemInit}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            測試系統初始化
          </button>
          
          <button 
            onClick={testAudioContext}
            className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            檢查AudioContext
          </button>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">測試宗教音效：</p>
            {['buddhism', 'taoism', 'mazu'].map(religion => (
              <button 
                key={religion}
                onClick={() => testSingleBeat(religion)}
                className="w-full bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
              >
                {religion === 'buddhism' ? '佛教' : religion === 'taoism' ? '道教' : '媽祖'}
              </button>
            ))}
          </div>
          
          <button 
            onClick={testRhythmSequence}
            disabled={isPlaying}
            className={`w-full px-4 py-2 rounded text-white ${
              isPlaying 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            {isPlaying ? '播放中...' : '測試節拍序列'}
          </button>
          
          <button 
            onClick={clearResults}
            className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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
      
      {/* 說明 */}
      <div className="mt-6 p-4 bg-yellow-50 rounded">
        <h3 className="font-bold mb-2">使用說明</h3>
        <ul className="text-sm space-y-1">
          <li>• 先測試系統初始化確保音效系統正常</li>
          <li>• 檢查AudioContext確認瀏覽器支持情況</li>
          <li>• 測試各宗教音效確認音效區別</li>
          <li>• 測試節拍序列確認時序控制</li>
          <li>• 如果沒有聲音，檢查瀏覽器音量和權限設定</li>
        </ul>
      </div>
    </div>
  );
};

export default AudioDebug;