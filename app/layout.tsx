import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sublet Profit Calculator',
  description: 'Calculate rental subletting scenarios by auto-filling unknown variables among rent, price per room, reserved rooms, target profit, and total rooms.',
  keywords: 'rental, sublet, profit, calculator, real estate, investment',
  authors: [{ name: 'Sublet Calculator' }],
  openGraph: {
    title: 'Sublet Profit Calculator',
    description: 'Calculate rental subletting scenarios by auto-filling unknown variables among rent, price per room, reserved rooms, target profit, and total rooms.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'Sublet Profit Calculator',
    description: 'Calculate rental subletting scenarios by auto-filling unknown variables among rent, price per room, reserved rooms, target profit, and total rooms.',
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
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

