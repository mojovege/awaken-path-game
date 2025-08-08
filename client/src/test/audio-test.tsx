// 音效系統測試組件
import React, { useState } from 'react';
import { SoundEffects } from '@/components/audio/sound-effects';
import BackgroundMusic from '@/components/audio/background-music';

const AudioTest = () => {
  const [isPlayingBG, setIsPlayingBG] = useState(false);
  const [currentReligion, setCurrentReligion] = useState<string>('buddhism');
  const [currentBGType, setCurrentBGType] = useState<'zen' | 'meditation' | 'fire'>('zen');
  
  const testSound = async (type: 'beat' | 'fire' | 'success' | 'error') => {
    await SoundEffects.playSound(type, currentReligion);
  };
  
  const toggleBackground = () => {
    setIsPlayingBG(!isPlayingBG);
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">音效系統測試工具</h2>
      
      {/* 宗教選擇 */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">選擇宗教：</label>
        <select 
          value={currentReligion} 
          onChange={(e) => setCurrentReligion(e.target.value)}
          className="border rounded px-3 py-2 mr-4"
        >
          <option value="buddhism">佛教</option>
          <option value="taoism">道教</option>
          <option value="mazu">媽祖</option>
        </select>
      </div>
      
      {/* 音效測試 */}
      <div className="mb-6">
        <h3 className="font-bold text-lg mb-3">音效測試</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => testSound('beat')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            節拍音效
          </button>
          <button 
            onClick={() => testSound('fire')}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            火焰音效
          </button>
          <button 
            onClick={() => testSound('success')}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            成功音效
          </button>
          <button 
            onClick={() => testSound('error')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            錯誤音效
          </button>
        </div>
      </div>
      
      {/* 背景音樂測試 */}
      <div className="mb-6">
        <h3 className="font-bold text-lg mb-3">背景音樂測試</h3>
        <div className="flex items-center space-x-4 mb-4">
          <select 
            value={currentBGType} 
            onChange={(e) => setCurrentBGType(e.target.value as 'zen' | 'meditation' | 'fire')}
            className="border rounded px-3 py-2"
          >
            <option value="zen">禪風音樂</option>
            <option value="meditation">冥想音樂</option>
            <option value="fire">火焰音效</option>
          </select>
          
          <button 
            onClick={toggleBackground}
            className={`px-4 py-2 rounded text-white ${
              isPlayingBG ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isPlayingBG ? '停止播放' : '開始播放'}
          </button>
        </div>
      </div>
      
      {/* 宗教音效說明 */}
      <div className="mb-6">
        <h3 className="font-bold text-lg mb-3">宗教音效特色</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded p-4">
            <h4 className="font-medium mb-2">佛教 🧘‍♂️</h4>
            <ul className="text-sm space-y-1">
              <li>• 節拍：高頻木魚聲 (800Hz)</li>
              <li>• 波形：正弦波</li>
              <li>• 特色：清脆、禪意</li>
            </ul>
          </div>
          
          <div className="border rounded p-4">
            <h4 className="font-medium mb-2">道教 ☯️</h4>
            <ul className="text-sm space-y-1">
              <li>• 節拍：中頻鼓聲 (400Hz)</li>
              <li>• 波形：方波</li>
              <li>• 特色：沉穩、厚重</li>
            </ul>
          </div>
          
          <div className="border rounded p-4">
            <h4 className="font-medium mb-2">媽祖 🌊</h4>
            <ul className="text-sm space-y-1">
              <li>• 節拍：中高頻海浪 (600Hz)</li>
              <li>• 波形：三角波</li>
              <li>• 特色：流動、溫柔</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* 背景音樂組件 */}
      <BackgroundMusic 
        audioType={currentBGType}
        isPlaying={isPlayingBG}
        volume={0.3}
      />
      
      {/* 測試說明 */}
      <div className="mt-6 p-4 bg-blue-50 rounded">
        <h3 className="font-bold text-lg mb-2">測試說明</h3>
        <ul className="text-sm space-y-1">
          <li>• 請在瀏覽器控制台查看音效調試信息</li>
          <li>• 確保瀏覽器允許播放音頻</li>
          <li>• 每個宗教的節拍音效都有不同的頻率和波形</li>
          <li>• 背景音樂適合不同類型的遊戲情境</li>
        </ul>
      </div>
    </div>
  );
};

export default AudioTest;