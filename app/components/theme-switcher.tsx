import { useEffect, useState } from 'react'
import { themes } from '~/registry/themes'
import useTheme from '~/hooks/use-theme'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Switch } from './ui/switch'
import { Sun, Moon } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'

/**
 * ThemeSwitcher Component
 * 
 * A comprehensive theme switching component that allows users to:
 * 1. Toggle between light and dark modes
 * 2. Select from multiple color themes (zinc, slate, stone, etc.)
 * 3. Persist preferences in localStorage
 * 4. Apply theme changes immediately without page refresh
 */
export default function ThemeSwitcher() {
  // Get current theme from custom hook (uses jotai for state management)
  const [theme, setTheme] = useTheme()
  
  // Local state for dark mode toggle (separate from theme selection)
  const [isDarkMode, setIsDarkMode] = useState(true)

  /**
   * Initialize dark mode state on component mount
   * Checks if 'dark' class exists on document element
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    }
  }, [])

  /**
   * Toggle between light and dark modes
   * - Updates local state
   * - Manipulates document class for Tailwind dark mode
   * - Persists preference in localStorage
   * - Immediately applies CSS variables for current theme
   */
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    
    // Update document class for Tailwind CSS dark mode
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
    
    // Apply current theme with new mode immediately
    // This ensures theme colors update without requiring a page refresh
    const themeObject: any = themes.find((t) => t.name === theme)
    if (themeObject) {
      const root = document.documentElement
      const modeVars = newDarkMode ? themeObject.cssVars.dark : themeObject.cssVars.light
      Object.keys(modeVars).forEach((property) => {
        root.style.setProperty(
          `--${property}`,
          modeVars[property]
        )
      })
    }
  }

  return (
    <div className="flex items-center space-x-4">
      {/* Dark Mode Toggle with Tooltip */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleDarkMode}>
              {/* Dynamic icon based on current mode */}
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-primary" />
              ) : (
                <Moon className="h-5 w-5 text-primary" />
              )}
              {/* Switch component from Radix UI */}
              <Switch checked={isDarkMode} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Theme Selection Dropdown */}
      <Select value={theme} onValueChange={(value: any) => {
        // Update theme in global state (jotai)
        setTheme(value)
        
        // Apply theme immediately without page refresh
        // This provides instant visual feedback to users
        const root = document.documentElement
        const themeObject: any = themes.find((t) => t.name === value)
        if (!themeObject) return
        
        // Get appropriate CSS variables based on current mode (light/dark)
        const modeVars = isDarkMode ? themeObject?.cssVars.dark : themeObject?.cssVars.light
        
        // Apply all CSS custom properties to document root
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
          {/* Render all available themes with color preview */}
          {themes.map((theme) => (
            <SelectItem key={theme.name} value={theme.name}>
              <div className="flex items-center gap-2">
                {/* Color preview circle showing theme's active color */}
                <div 
                  className="h-4 w-4 rounded-full" 
                  style={{ backgroundColor: `hsl(${isDarkMode ? theme.activeColor.dark : theme.activeColor.light})` }} 
                />
                {/* Theme display name */}
                {theme.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}