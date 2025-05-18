import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            tying.ai
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            即将登录，敬请期待
          </p>
          <div className="relative w-64 h-64 mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-white rounded-full opacity-10"></div>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-gray-400">
              我们正在打造下一代 AI 体验
            </p>
            <div className="flex space-x-4 justify-center">
              <a href="#" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors">
                加入等待列表
              </a>
              <a href="#" className="px-6 py-3 border border-gray-600 hover:border-gray-400 rounded-full transition-colors">
                了解更多
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 