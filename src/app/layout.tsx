import './globals.css'
import type { Metadata } from 'next'
import Providers from './providers'

export const metadata: Metadata = {
  title: 'Breathe App',
  description: 'A mindful breathing application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black overflow-x-hidden">
        <Providers>
          <main className="container py-10 px-4 mx-auto min-h-screen flex items-center justify-center">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}