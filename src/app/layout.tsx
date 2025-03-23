import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'tying.ai - Coming Soon',
  description: 'We are building the next generation of AI experience',
  metadataBase: new URL('https://tying.ai'),
  openGraph: {
    title: 'tying.ai - Coming Soon',
    description: 'We are building the next generation of AI experience',
    url: 'https://tying.ai',
    siteName: 'tying.ai',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'tying.ai - Coming Soon',
    description: 'We are building the next generation of AI experience',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
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