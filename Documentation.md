# Put Me On - Project Documentation

## Overview

Put Me On is a modern web application built with Remix, React, and TypeScript. It features a sophisticated theming system that supports multiple color schemes and dark/light mode switching with real-time updates.


## Theming System

### Architecture

The theming system is built on three main components:

1. **Theme Definitions** (`themes.ts`): Defines available themes with CSS variables
2. **Theme Hook** (`use-theme.tsx`): Manages theme state using Jotai
3. **Theme Switcher** (`theme-switcher.tsx`): UI component for theme selection

### Key Features

- **Multiple Color Schemes**: Supports zinc, slate, stone, gray, neutral, red, rose, orange, green, blue, yellow, and violet themes
- **Dark/Light Mode**: Independent dark/light mode toggle for each theme
- **Real-time Updates**: Theme changes apply immediately without page refresh
- **Persistence**: Theme preferences saved in localStorage
- **CSS Variables**: Uses CSS custom properties for dynamic theming

### Theme Structure

Each theme in `themes.ts` contains:

```typescript
{
  name: string,           // Internal identifier
  label: string,          // Display name
  activeColor: {          // Preview colors
    light: string,        // HSL values for light mode
    dark: string          // HSL values for dark mode
  },
  cssVars: {             // CSS custom properties
    light: { ... },       // Light mode variables
    dark: { ... }         // Dark mode variables
  }
}
```

### CSS Variables

The system uses CSS custom properties for:
- `--background`: Main background color
- `--foreground`: Primary text color
- `--primary`: Primary brand color
- `--secondary`: Secondary elements
- `--border`: Border colors
- `--input`: Form input styling
- `--card`: Card backgrounds
- `--popover`: Dropdown/popover styling
- `--destructive`: Error/warning states

## Key Components

### Root Layout (`root.tsx`)

**Purpose**: Application shell and theme initialization

**Key Features**:
- Applies saved theme on page load
- Initializes dark mode from localStorage
- Integrates analytics and error tracking
- Sets up HTML structure and meta tags

**Theme Initialization**:
```typescript
useEffect(() => {
  if (typeof window !== 'undefined') {
    // Apply saved theme
    changeTheme(getTheme())
    
    // Apply dark mode preference
    const darkMode = localStorage.getItem('darkMode')
    if (darkMode === 'false') {
      document.documentElement.classList.remove('dark')
    }
  }
}, [])
```

### Theme Hook (`use-theme.tsx`)

**Purpose**: Global theme state management

**Key Features**:
- Uses Jotai for reactive state management
- Provides `changeTheme` function for applying themes
- Includes `getTheme` function for retrieving saved preferences
- Handles localStorage persistence

**Usage**:
```typescript
const [theme, setTheme] = useTheme()
```

### Theme Switcher (`theme-switcher.tsx`)

**Purpose**: User interface for theme selection

**Key Features**:
- Dark/light mode toggle with visual icons
- Theme dropdown with color previews
- Immediate theme application
- Accessible tooltips and interactions

**Components Used**:
- `Switch`: Dark mode toggle (Radix UI)
- `Select`: Theme dropdown (Radix UI)
- `Tooltip`: Contextual help (Radix UI)
- `Sun`/`Moon`: Mode icons (Lucide React)

## Styling System

### Tailwind CSS Configuration

The project uses Tailwind CSS with:
- Custom color palette based on CSS variables
- Dark mode support via class strategy
- Custom fonts (DM Sans, Caveat, Inter)
- Extended spacing and animation utilities

### CSS Variables Integration

```css
:root {
  --background: 0 0% 100%;     /* Light mode background */
  --foreground: 222.2 84% 4.9%; /* Light mode text */
  /* ... more variables */
}

.dark {
  --background: 222.2 84% 4.9%; /* Dark mode background */
  --foreground: 210 40% 98%;    /* Dark mode text */
  /* ... more variables */
}
```

### Utility Classes

- `bg-background`: Uses CSS variable for background
- `text-foreground`: Uses CSS variable for text
- `border-border`: Uses CSS variable for borders
- Custom gradient utilities for enhanced visuals

## Development Guidelines

### Adding New Themes

1. Add theme definition to `themes.ts`:
```typescript
{
  name: 'new-theme',
  label: 'New Theme',
  activeColor: {
    light: '210 40% 50%',
    dark: '210 40% 60%'
  },
  cssVars: {
    light: { /* CSS variables */ },
    dark: { /* CSS variables */ }
  }
}
```

2. Theme will automatically appear in the switcher

### Modifying Theme Colors

1. Update CSS variables in theme definition
2. Use HSL format for consistency
3. Test in both light and dark modes
4. Ensure sufficient contrast ratios

### Best Practices

- Always use CSS variables for themeable properties
- Test theme changes across all components
- Maintain accessibility standards
- Use semantic color names (primary, secondary, etc.)
- Document any new CSS variables added

## Technical Stack

- **Framework**: Remix (React-based)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Jotai
- **UI Components**: Radix UI (shadcn/ui)
- **Icons**: Lucide React
- **Analytics**: Vercel Analytics
- **Error Tracking**: Highlight

## Browser Support

The theming system requires:
- CSS Custom Properties support
- localStorage API
- Modern JavaScript features (ES6+)

Supported browsers:
- Chrome 49+
- Firefox 31+
- Safari 9.1+
- Edge 16+
