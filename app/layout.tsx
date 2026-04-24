import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Zootopia: A City of Many Flavors',
  description: 'An interactive story.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body style={{ margin: 0, padding: 0, overflow: 'hidden', width: '100vw', height: '100dvh' }}>
        {children}
      </body>
    </html>
  )
}
