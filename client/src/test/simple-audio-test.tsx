// 簡單音效測試組件
import React from 'react';
import { SoundEffects } from '@/components/audio/sound-effects';

const SimpleAudioTest = () => {
  
  const testBasicSound = async () => {
    console.log('開始基本音效測試');
    try {
      await SoundEffects.playSound('beat', 'buddhism');
    } catch (error) {
      console.error('音效測試失敗:', error);
    }
  };

  const testAllReligions = async () => {
    console.log('測試所有宗教音效');
    const religions = ['buddhism', 'taoism', 'mazu'];
    
    for (let i = 0; i < religions.length; i++) {
      const religion = religions[i];
      console.log(`測試 ${religion} 音效`);
      
      setTimeout(async () => {
        try {
          await SoundEffects.playSound('beat', religion);
        } catch (error) {
          console.error(`${religion} 音效失敗:`, error);
        }
      }, i * 1000);
    }
  };

  const testContinuousBeats = async () => {
    console.log('測試連續節拍');
    for (let i = 0; i < 5; i++) {
      setTimeout(async () => {
        try {
          await SoundEffects.playSound('beat', 'buddhism');
        } catch (error) {
          console.error('連續節拍失敗:', error);
        }
      }, i * 500);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">簡單音效測試</h2>
      
      <div className="space-y-4">
        <button 
          onClick={testBasicSound}
          className="w-full bg-blue-500 text-white px-4 py-3 rounded text-lg hover:bg-blue-600"
        >
          測試基本音效
        </button>
        
        <button 
          onClick={testAllReligions}
          className="w-full bg-green-500 text-white px-4 py-3 rounded text-lg hover:bg-green-600"
        >
          測試所有宗教音效
        </button>
        
        <button 
          onClick={testContinuousBeats}
          className="w-full bg-purple-500 text-white px-4 py-3 rounded text-lg hover:bg-purple-600"
        >
          測試連續節拍
        </button>
      </div>
      
      <div className="mt-6 p-4 bg-yellow-50 rounded">
        <p className="text-sm">
          <strong>使用說明：</strong><br/>
          1. 點擊按鈕測試音效<br/>
          2. 檢查瀏覽器控制台的日誌<br/>
          3. 確保瀏覽器允許播放音頻<br/>
          4. 如果沒有聲音，檢查音量設定
        </p>
      </div>
    </div>
  );
};

export default SimpleAudioTest;