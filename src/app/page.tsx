export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          {/* Logo/Title */}
          <div className="relative mb-12">
            <h1 className="text-7xl md:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 tracking-tight">
              tying.ai
            </h1>
          </div>

          {/* Coming Soon Text */}
          <p className="text-3xl md:text-4xl text-gray-300 font-light tracking-wider mb-16">
            Coming Soon
          </p>

          {/* Description */}
          <div className="space-y-6 max-w-2xl">
            <p className="text-2xl text-gray-400 font-light tracking-wide leading-relaxed">
              We are building the next generation of AI experience
            </p>
            <div className="h-px w-40 bg-gradient-to-r from-transparent via-gray-400/50 to-transparent mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 py-6 text-center text-gray-500 text-sm">
        <div className="container mx-auto px-4">
          <p className="font-light tracking-wide">© 2024 tying.ai. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
} 