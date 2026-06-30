import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'dark' | 'light'
interface ThemeCtx { theme: Theme; isDark: boolean; toggle: () => void }

const Ctx = createContext<ThemeCtx>({ theme: 'dark', isDark: true, toggle: () => {} })

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('fp-theme') as Theme) ?? 'dark'
  })

  useEffect(() => {
    const h = document.documentElement
    if (theme === 'dark') { h.classList.add('dark'); h.classList.remove('light') }
    else { h.classList.remove('dark'); h.classList.add('light') }
    localStorage.setItem('fp-theme', theme)
  }, [theme])

  useEffect(() => {
    const t = localStorage.getItem('fp-theme') ?? 'dark'
    document.documentElement.classList.add(t)
  }, [])

  return (
    <Ctx.Provider value={{ theme, isDark: theme === 'dark', toggle: () => setTheme(t => t === 'dark' ? 'light' : 'dark') }}>
      {children}
    </Ctx.Provider>
  )
}

export const useTheme = () => useContext(Ctx)
