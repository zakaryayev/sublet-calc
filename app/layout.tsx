import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://zakaryayev.com'),
  title: 'Sublet Profit Calculator',
  description: 'Calculate subletting profitability with one unknown auto-solved.',
  keywords: 'rental, sublet, profit, calculator, real estate, investment',
  authors: [{ name: 'Sublet Calculator' }],
  alternates: {
    // canonical should include the basePath if present
    canonical: process.env.NEXT_PUBLIC_BASE_PATH || '/',
  },
  openGraph: {
    title: 'Sublet Profit Calculator',
    description: 'Calculate subletting profitability with one unknown auto-solved.',
    url: process.env.NEXT_PUBLIC_BASE_PATH || '/',
    siteName: 'zakaryayev.com',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'Sublet Profit Calculator',
    description: 'Calculate subletting profitability with one unknown auto-solved.',
  },
  robots: 'index, follow',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}

