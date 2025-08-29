import { useEffect, useState } from 'react'
import { themes } from '~/registry/themes'
import useTheme from '~/hooks/use-theme'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Switch } from './ui/switch'
import { Sun, Moon } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'

export default function ThemeSwitcher() {
  const [theme, setTheme] = useTheme()
  const [isDarkMode, setIsDarkMode] = useState(true)

  // Initialize dark mode state based on document class
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    }
  }, [])

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }

  return (
    <div className="flex items-center space-x-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleDarkMode}>
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-primary" />
              ) : (
                <Moon className="h-5 w-5 text-primary" />
              )}
              <Switch checked={isDarkMode} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Select value={theme} onValueChange={(value: any) => {
        setTheme(value)
        // Apply theme immediately without page refresh
        const root = document.documentElement
        const themeObject: any = themes.find((t) => t.name === value)
        if (!themeObject) return
        
        const modeVars = isDarkMode ? themeObject?.cssVars.dark : themeObject?.cssVars.light
        Object.keys(modeVars).forEach((property) => {
          root.style.setProperty(
            `--${property}`,
            modeVars[property]
          )
        })
      }}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          {themes.map((theme) => (
            <SelectItem key={theme.name} value={theme.name}>
              <div className="flex items-center gap-2">
                <div 
                  className="h-4 w-4 rounded-full" 
                  style={{ backgroundColor: `hsl(${isDarkMode ? theme.activeColor.dark : theme.activeColor.light})` }} 
                />
                {theme.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}