import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'tying.ai - 即将登录',
  description: 'tying.ai 即将登录，敬请期待',
  openGraph: {
    title: 'Tying.ai - Smart AI Assistant',
    description: 'Providing professional AI solutions. Coming soon.',
    url: 'https://tying.ai',
    siteName: 'Tying.ai',
    images: [
      {
        url: 'https://tying.ai/og-image.jpg',
        width: 800,
        height: 600,
        alt: 'Tying.ai Logo',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@tyingai',
    title: 'Tying.ai - Smart AI Assistant',
    description: 'Providing professional AI solutions. Coming soon.',
    images: ['https://tying.ai/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>{children}</body>
    </html>
  )
} 