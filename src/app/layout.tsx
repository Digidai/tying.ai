import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'tying.ai - Coming Soon',
  description: 'tying.ai is coming soon, stay tuned',
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
    locale: 'en_US',
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
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
} 