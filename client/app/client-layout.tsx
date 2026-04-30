'use client';

import { ThemeProvider } from '@/components/theme-provider'
import { AnimatedBackground } from '@/components/animated-background'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/contexts/language-context'
import { AuthProvider } from '@/contexts/auth-context'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <LanguageProvider>
          <AnimatedBackground />
          {children}
          <Analytics />
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
