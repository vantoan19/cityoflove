import type { Metadata, Viewport } from 'next'
import { Inter, Caveat, Lilita_One } from 'next/font/google'
import './globals.css'

const inter     = Inter({ subsets: ['latin'], variable: '--font-inter' })
const caveat    = Caveat({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-caveat' })
const lilitaOne = Lilita_One({ subsets: ['latin'], weight: '400', variable: '--font-lilita' })

export const metadata: Metadata = {
  title: 'Zootopia: A City of Many Flavors',
  description: 'An interactive story.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${caveat.variable} ${lilitaOne.variable}`}>
      <body style={{ margin: 0, padding: 0, overflow: 'hidden', width: '100vw', height: '100dvh' }}>
        {children}
      </body>
    </html>
  )
}
