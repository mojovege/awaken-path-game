export default function Home() {
  return (
    <div>
      <h1>
        <p className="text-3xl md:text-4xl text-amber-700 mb-12">
          智慧覺醒・心靈昇華
        </p>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="bg-white/95 rounded-3xl shadow-2xl p-18 hover:scale-105 transition-all cursor-pointer">
          <div className="text-9xl mb-6">🧘</div>
          <h2 className="text-4xl md:text-5xl font-bold text-orange-600 mb-4">
            覺醒導航
          </h2>
          <p className="text-2xl text-gray-700">開啟覺醒・引領旅程</p>
        </div>

        <div className="bg-white/95 rounded-3xl shadow-2xl p-18 hover:scale-105 transition-all cursor-pointer">
          <div className="text-9xl mb-6">🎯</div>
          <h2 className="text-4xl md:text-5xl font-bold text-green-600 mb-4">
            獲得覺醒
          </h2>
          <p className="text-2xl text-gray-700">覺醒點・智慧成長</p>
        </div>

        <div className="bg-white/95 rounded-3xl shadow-2xl p-18 hover:scale-105 transition-all cursor-pointer">
          <div className="text-9xl mb-6">📚</div>
          <h2 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">
            開悟指南
          </h2>
          <p className="text-2xl text-gray-700">覺醒課程・精神成長</p>
        </div>
      </div>

      <p className="text-3xl text-amber-600 mt-12">
        與我們踏上人類精神覺醒之旅
      </p>
    </div>
  )
}
