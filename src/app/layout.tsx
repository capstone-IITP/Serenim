import './globals.css'
import type { Metadata } from 'next'
import Providers from './providers'
import ThemeProvider from './theme/ThemeContext'
import ThemeSwitcher from './components/ThemeSwitcher'
import ThemeEffects from './components/ThemeEffects'

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
      <body className="theme-cosmic min-h-screen overflow-x-hidden">
        <div className="fixed inset-0 stellar-bg -z-10"></div>
        <ThemeProvider>
          <ThemeEffects />
          <Providers>
            <main className="container py-10 px-4 mx-auto min-h-screen flex items-center justify-center">
              {children}
            </main>
            <ThemeSwitcher />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}