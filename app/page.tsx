// app/page.tsx   <--- 路徑一定要是這個！
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center">
      <div className="text-center p-10">
        <h1 className="text-6xl font-bold text-amber-800 mb-8">
          覺悟之旅
        </h1>
        <p className="text-3xl text-amber-700 mb-12">
          智慧養成 · 心靈陪伴
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl">
          <div className="bg-white/90 rounded-3xl shadow-2xl p-10 hover:scale-105 transition-all">
            <div className="text-8xl mb-4">🪷</div>
            <h2 className="text-4xl font-bold text-orange-600">佛教修行</h2>
            <p className="text-2xl mt-4">慈悲為懷，智慧增長</p>
          </div>
          <div className="bg-white/90 rounded-3xl shadow-2xl p-10 hover:scale-105 transition-all">
            <div className="text-8xl mb-4">☯️</div>
            <h2 className="text-4xl font-bold text-green-600">道教養生</h2>
            <p className="text-2xl mt-4">順應自然，修身養性</p>
          </div>
          <div className="bg-white/90 rounded-3xl shadow-2xl p-10 hover:scale-105 transition-all">
            <div className="text-8xl mb-4">🌊</div>
            <h2 className="text-4xl font-bold text-blue-600">媽祖護佑</h2>
            <p className="text-2xl mt-4">慈悲渡世，護佑平安</p>
          </div>
        </div>
      </div>
    </main>
  );
}
