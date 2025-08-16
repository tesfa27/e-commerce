// Centralized Color Configuration - Customize your theme here
export const colorConfig = {
  // Brand Colors - Change these to customize your theme
  brand: {
    primary: 'emerald',    // Main brand color (emerald, blue, purple, etc.)
    secondary: 'teal',     // Secondary brand color
    accent: 'green',       // Accent color for success states
    danger: 'red',         // Error/danger color
    warning: 'yellow',     // Warning color
    info: 'blue',          // Info color
  },
  
  // Neutral Colors
  neutral: {
    light: 'gray-50',
    medium: 'gray-200', 
    dark: 'gray-600',
    darker: 'gray-900',
  }
};

// Auto-generated color classes based on configuration
export const colors = {
  // Primary Colors
  primary: {
    50: `bg-${colorConfig.brand.primary}-50`,
    100: `bg-${colorConfig.brand.primary}-100`, 
    500: `bg-${colorConfig.brand.primary}-500`,
    600: `bg-${colorConfig.brand.primary}-600`,
    700: `bg-${colorConfig.brand.primary}-700`,
    text: `text-${colorConfig.brand.primary}-600`,
    textLight: `text-${colorConfig.brand.primary}-500`,
    textDark: `text-${colorConfig.brand.primary}-700`,
    border: `border-${colorConfig.brand.primary}-600`,
    ring: `ring-${colorConfig.brand.primary}-500`,
    focus: `focus:ring-${colorConfig.brand.primary}-500`,
  },
  
  // Secondary Colors
  secondary: {
    600: `bg-${colorConfig.brand.secondary}-600`,
    text: `text-${colorConfig.brand.secondary}-600`,
  },
  
  // Success/Accent Colors
  success: {
    100: `bg-${colorConfig.brand.accent}-100`,
    600: `text-${colorConfig.brand.accent}-600`,
    800: `text-${colorConfig.brand.accent}-800`,
  },
  
  // Danger Colors
  danger: {
    50: `bg-${colorConfig.brand.danger}-50`,
    100: `bg-${colorConfig.brand.danger}-100`,
    300: `border-${colorConfig.brand.danger}-300`,
    500: `focus:ring-${colorConfig.brand.danger}-500`,
    600: `text-${colorConfig.brand.danger}-600`,
    700: `text-${colorConfig.brand.danger}-700`,
  },
  
  // Text Colors
  text: {
    primary: `text-${colorConfig.brand.primary}-600`,
    secondary: `text-${colorConfig.neutral.dark}`,
    dark: `text-${colorConfig.neutral.darker}`,
    light: `text-gray-700`,
    white: 'text-white',
    muted: 'text-gray-500',
  },
  
  // Background Colors
  background: {
    primary: `bg-${colorConfig.neutral.light}`,
    white: 'bg-white',
    gradient: `bg-gradient-to-r from-${colorConfig.brand.primary}-600 to-${colorConfig.brand.secondary}-600`,
    hover: 'hover:bg-gray-50',
  },
  
  // Border Colors
  border: {
    light: `border-${colorConfig.neutral.medium}`,
    primary: `border-${colorConfig.brand.primary}-600`,
    gray: 'border-gray-300',
    divider: 'divide-gray-200',
  },
  
  // Interactive States
  interactive: {
    hover: {
      primary: `hover:bg-${colorConfig.brand.primary}-700`,
      secondary: 'hover:bg-gray-50',
      danger: `hover:bg-${colorConfig.brand.danger}-50`,
    },
    focus: {
      primary: `focus:ring-${colorConfig.brand.primary}-500`,
      danger: `focus:ring-${colorConfig.brand.danger}-500`,
    }
  }
};

// Component Styles - Uses centralized colors
export const components = {
  // Buttons
  button: {
    primary: `${colors.primary[600]} ${colors.interactive.hover.primary} text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md`,
    secondary: `bg-white ${colors.interactive.hover.secondary} text-gray-700 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${colors.border.gray} shadow-sm hover:shadow-md`,
    danger: `bg-white ${colors.interactive.hover.danger} ${colors.danger[700]} px-2 py-1 border ${colors.danger[300]} shadow-sm text-xs leading-4 font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 ${colors.interactive.focus.danger} transition-colors`,
  },
  
  // Cards
  card: {
    base: 'bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200',
    product: 'card group cursor-pointer transform transition-all duration-200 hover:scale-105',
  },
  
  // Layout
  layout: {
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    smallContainer: 'max-w-md mx-auto px-4',
    section: 'py-16',
    hero: 'py-20',
  },
  
  // Typography
  typography: {
    h1: 'text-5xl font-bold mb-6',
    h2: 'text-3xl font-bold text-gray-900 mb-4',
    h3: 'text-xl font-semibold mb-2',
    subtitle: 'text-xl mb-8 text-blue-100',
    body: 'text-gray-600',
  },
  
  // Grid
  grid: {
    products: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8',
    features: 'grid grid-cols-1 md:grid-cols-3 gap-8',
  },
  
  // Icons
  icon: {
    feature: `w-16 h-16 ${colors.primary[100]} rounded-full flex items-center justify-center mx-auto mb-4`,
    featureIcon: `w-8 h-8 ${colors.primary.text}`,
    small: `w-5 h-5 ${colors.primary.text}`,
    medium: `w-8 h-8 ${colors.primary.text}`,
  },
  
  // States
  states: {
    loading: 'flex justify-center py-20',
    error: 'flex justify-center py-20',
    inStock: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.success[100]} ${colors.success[800]}`,
    outOfStock: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.danger[100]} ${colors.danger[700]}`,
    badge: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.primary[100]} ${colors.primary.textDark}`,
  },
  
  // Forms
  form: {
    input: `w-full px-4 py-3 ${colors.border.light} rounded-lg focus:outline-none focus:ring-2 ${colors.interactive.focus.primary} transition-colors`,
    label: `block text-sm font-medium ${colors.text.dark} mb-2`,
    error: `text-sm ${colors.danger[600]} mt-1`,
  },
  
  // Navigation
  nav: {
    link: `${colors.text.primary} hover:${colors.primary.textDark} transition-colors font-medium`,
    activeLink: `${colors.primary.textDark} font-semibold`,
  },
  
  // Tables
  table: {
    header: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
    cell: 'px-6 py-4 whitespace-nowrap',
    row: `${colors.background.hover} transition-colors`,
  }
};

// Utility Classes
export const utils = {
  textGradient: `bg-gradient-to-r from-${colorConfig.brand.primary}-600 to-${colorConfig.brand.secondary}-600 bg-clip-text text-transparent`,
  centerText: 'text-center',
  flexCenter: 'flex items-center justify-center',
  transition: 'transition-colors duration-200',
  shadow: 'shadow-sm hover:shadow-md',
};

// Theme Customization Guide
export const themeGuide = {
  // To change the entire theme, modify the colorConfig object above:
  // 
  // Example: Blue theme
  // brand: { primary: 'blue', secondary: 'indigo', accent: 'green', danger: 'red' }
  // 
  // Example: Purple theme  
  // brand: { primary: 'purple', secondary: 'pink', accent: 'green', danger: 'red' }
  // 
  // Available Tailwind colors: red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose
};