// 宗教內容測試組件
import React, { useState } from 'react';
import { RELIGIOUS_CONTENT } from '@/lib/game-config';

const ReligionContentTest = () => {
  const [selectedReligion, setSelectedReligion] = useState<string>('buddhism');
  
  const religionData = RELIGIOUS_CONTENT[selectedReligion as keyof typeof RELIGIOUS_CONTENT];
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">宗教內容測試工具</h2>
      
      {/* 宗教選擇器 */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">選擇宗教：</label>
        <select 
          value={selectedReligion} 
          onChange={(e) => setSelectedReligion(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="buddhism">佛教</option>
          <option value="taoism">道教</option>
          <option value="mazu">媽祖</option>
        </select>
      </div>
      
      {/* 宗教資料顯示 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 基本信息 */}
        <div className="border rounded p-4">
          <h3 className="font-bold text-lg mb-3">基本信息</h3>
          <p><strong>名稱：</strong>{religionData.name}</p>
          <p><strong>表情符號：</strong>{religionData.emoji}</p>
        </div>
        
        {/* 建築物 */}
        <div className="border rounded p-4">
          <h3 className="font-bold text-lg mb-3">建築物</h3>
          <div className="space-y-2">
            {religionData.buildings.map((building, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span>{religionData.buildingEmojis[index]}</span>
                <span>{building}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* 概念配對 */}
        <div className="border rounded p-4 md:col-span-2">
          <h3 className="font-bold text-lg mb-3">概念配對</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {religionData.concepts.map((concept, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded">
                <div className="flex justify-between">
                  <span className="font-medium text-blue-600">{concept.text}</span>
                  <span className="text-gray-600">→</span>
                  <span className="font-medium text-green-600">{concept.match}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* 測試結果 */}
      <div className="mt-6 p-4 bg-green-50 rounded">
        <h3 className="font-bold text-lg mb-2">測試結果</h3>
        <p className="text-green-700">
          ✓ 宗教資料載入正常：{religionData.name}
        </p>
        <p className="text-green-700">
          ✓ 建築數量：{religionData.buildings.length}個
        </p>
        <p className="text-green-700">
          ✓ 概念配對數量：{religionData.concepts.length}組
        </p>
      </div>
    </div>
  );
};

export default ReligionContentTest;