export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-orange-100">
      <div className="text-center max-w-4xl px-4">
        <h1 className="text-6xl md:text-7xl font-bold text-amber-800 mb-6">
          覺醒之路
        </h1>
        <p className="text-3xl md:text-4xl text-amber-700 mb-12">
          智慧覺醒・心靈昇華
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/90 rounded-xl p-6 shadow-lg">
            <div className="text-5xl mb-4">{'🧘'}</div>
            <h2 className="text-2xl font-bold text-orange-600 mb-2">覺醒導航</h2>
            <p className="text-gray-700">開啟覺醒之旅</p>
          </div>
          <div className="bg-white/90 rounded-xl p-6 shadow-lg">
            <div className="text-5xl mb-4">{'🎯'}</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">獲得覺醒</h2>
            <p className="text-gray-700">累積智慧點數</p>
          </div>
          <div className="bg-white/90 rounded-xl p-6 shadow-lg">
            <div className="text-5xl mb-4">{'📚'}</div>
            <h2 className="text-2xl font-bold text-blue-600 mb-2">開悟指南</h2>
            <p className="text-gray-700">探索覺醒課程</p>
          </div>
        </div>
      </div>
    </main>
  )
}
