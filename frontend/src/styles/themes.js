// Pre-defined Theme Configurations
// Import and use these in theme.js to quickly switch themes

export const themes = {
  // Current Emerald Theme
  emerald: {
    brand: {
      primary: 'emerald',
      secondary: 'teal', 
      accent: 'green',
      danger: 'red',
      warning: 'yellow',
      info: 'blue',
    }
  },

  // Blue Theme
  blue: {
    brand: {
      primary: 'blue',
      secondary: 'indigo',
      accent: 'green', 
      danger: 'red',
      warning: 'yellow',
      info: 'cyan',
    }
  },

  // Purple Theme
  purple: {
    brand: {
      primary: 'purple',
      secondary: 'pink',
      accent: 'green',
      danger: 'red', 
      warning: 'yellow',
      info: 'blue',
    }
  },

  // Orange Theme
  orange: {
    brand: {
      primary: 'orange',
      secondary: 'red',
      accent: 'green',
      danger: 'red',
      warning: 'yellow', 
      info: 'blue',
    }
  },

  // Rose Theme
  rose: {
    brand: {
      primary: 'rose',
      secondary: 'pink',
      accent: 'green',
      danger: 'red',
      warning: 'yellow',
      info: 'blue',
    }
  }
};

// Usage Instructions:
// 1. Import desired theme: import { themes } from './themes.js'
// 2. Replace colorConfig in theme.js with: export const colorConfig = themes.blue;
// 3. All components will automatically use the new color scheme