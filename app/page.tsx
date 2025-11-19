// app/page.tsx
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center p-6">
      <div className="text-center max-w-7xl">
        <h1 className="text-6xl md:text-7xl font-bold text-amber-800 mb-6">
          覺悟之旅
        </h1>
        <p className="text-3xl md:text-4xl text-amber-700 mb-12">
          智慧養成 · 心靈陪伴
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* 佛教修行 */}
          <div className="bg-white/95 rounded-3xl shadow-2xl p-10 hover:scale-105 transition-all cursor-pointer">
            <div className="text-9xl mb-6">🪷</div>
            <h2 className="text-4xl md:text-5xl font-bold text-orange-600 mb-4">
              佛教修行
            </h2>
            <p className="text-2xl text-gray-700">慈悲為懷 · 智慧增長</p>
          </div>

          {/* 道教養生 */}
          <div className="bg-white/95 rounded-3xl shadow-2xl p-10 hover:scale-105 transition-all cursor-pointer">
            <div className="text-9xl mb-6">☯️</div>
            <h2 className="text-4xl md:text-5xl font-bold text-green-600 mb-4">
              道教養生
            </h2>
            <p className="text-2xl text-gray-700">順應自然 · 修身養性</p>
          </div>

          {/* 媽祖護佑 */}
          <div className="bg-white/95 rounded-3xl shadow-2xl p-10 hover:scale-105 transition-all cursor-pointer">
            <div className="text-9xl mb-6">🌊</div>
            <h2 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">
              媽祖護佑
            </h2>
            <p className="text-2xl text-gray-700">慈悲渡世 · 護佑平安</p>
          </div>
        </div>

        <p className="text-xl text-amber-600 mt-16">
          點擊上方卡片開始您的覺悟之旅
        </p>
      </div>
    </main>
  );
}
      </div>
    </main>
  );
}
