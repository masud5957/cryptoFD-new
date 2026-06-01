'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

function ThemeProviderInner({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider 
      {...props} 
      attribute="class" 
      suppressHydrationWarning 
      enableSystem 
      storageKey="theme"
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}

// Dynamically import with ssr: false to prevent script injection
export const ThemeProvider = dynamic(
  () => Promise.resolve(ThemeProviderInner),
  { ssr: false }
)
