export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          {/* Logo/Title */}
          <div className="relative mb-12">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
            <h1 className="relative text-7xl md:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient tracking-tight">
              tying.ai
            </h1>
          </div>

          {/* Coming Soon Text */}
          <div className="relative mb-16">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-xl"></div>
            <p className="relative text-3xl md:text-4xl text-gray-300 font-light tracking-wider">
              Coming Soon
            </p>
          </div>

          {/* Animated Circle */}
          <div className="relative w-80 h-80 mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 bg-white/10 rounded-full animate-ping"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 bg-white/5 rounded-full"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-white/5 rounded-full"></div>
            </div>
          </div>

          {/* Description */}
          <div className="relative space-y-6 max-w-2xl">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-xl"></div>
            <p className="relative text-2xl text-gray-400 font-light tracking-wide leading-relaxed">
              We are building the next generation of AI experience
            </p>
            <div className="relative h-px w-40 bg-gradient-to-r from-transparent via-gray-400/50 to-transparent mx-auto"></div>
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