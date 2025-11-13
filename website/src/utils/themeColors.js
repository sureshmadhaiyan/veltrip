// Premium color palettes for cab service websites

export const premiumThemes = {
  // Taxi Yellow & Green (Default)
  taxiYellowGreen: {
    name: 'Taxi Yellow & Green',
    primaryColor: '#FFC107', // Taxi Yellow
    secondaryColor: '#4CAF50', // Green
    accentColor: '#FFD54F', // Light Yellow
    textColor: '#1f2937',
    backgroundColor: '#ffffff',
  },
  
  // Emerald Gold
  emeraldGold: {
    name: 'Emerald Gold',
    primaryColor: '#FFD700', // Gold
    secondaryColor: '#00C853', // Emerald Green
    accentColor: '#FFEB3B', // Bright Yellow
    textColor: '#1f2937',
    backgroundColor: '#ffffff',
  },
  
  // Lime Amber
  limeAmber: {
    name: 'Lime Amber',
    primaryColor: '#FFC107', // Amber
    secondaryColor: '#8BC34A', // Light Green
    accentColor: '#FFEB3B', // Yellow
    textColor: '#1f2937',
    backgroundColor: '#ffffff',
  },
  
  // Classic Taxi
  classicTaxi: {
    name: 'Classic Taxi',
    primaryColor: '#FDB813', // Taxi Yellow
    secondaryColor: '#00A859', // Taxi Green
    accentColor: '#FFD700', // Gold
    textColor: '#1f2937',
    backgroundColor: '#ffffff',
  },
  
  // Vibrant Yellow Green
  vibrantYellowGreen: {
    name: 'Vibrant Yellow Green',
    primaryColor: '#FFEB3B', // Bright Yellow
    secondaryColor: '#4CAF50', // Green
    accentColor: '#CDDC39', // Lime
    textColor: '#1f2937',
    backgroundColor: '#ffffff',
  },
  
  // Premium Gold Green
  premiumGoldGreen: {
    name: 'Premium Gold Green',
    primaryColor: '#FFC107', // Amber
    secondaryColor: '#388E3C', // Dark Green
    accentColor: '#FFD54F', // Light Amber
    textColor: '#1f2937',
    backgroundColor: '#ffffff',
  },
  
  // Luxury Gold Emerald
  luxuryGoldEmerald: {
    name: 'Luxury Gold Emerald',
    primaryColor: '#FFD700', // Gold
    secondaryColor: '#00A859', // Emerald
    accentColor: '#FFA500', // Orange
    textColor: '#1f2937',
    backgroundColor: '#ffffff',
  },
  
  // Vibrant Taxi
  vibrantTaxi: {
    name: 'Vibrant Taxi',
    primaryColor: '#FFEB3B', // Bright Yellow
    secondaryColor: '#4CAF50', // Green
    accentColor: '#FFC107', // Amber
    textColor: '#1f2937',
    backgroundColor: '#ffffff',
  },
  
  // Classic Yellow Green
  classicYellowGreen: {
    name: 'Classic Yellow Green',
    primaryColor: '#FDB813', // Taxi Yellow
    secondaryColor: '#00C853', // Material Green
    accentColor: '#FFD54F', // Light Yellow
    textColor: '#1f2937',
    backgroundColor: '#ffffff',
  },
  
  // Premium Amber Green
  premiumAmberGreen: {
    name: 'Premium Amber Green',
    primaryColor: '#FF6F00', // Deep Amber
    secondaryColor: '#2E7D32', // Forest Green
    accentColor: '#FFB300', // Amber
    textColor: '#1f2937',
    backgroundColor: '#ffffff',
  },
  
  // Modern Lime Gold
  modernLimeGold: {
    name: 'Modern Lime Gold',
    primaryColor: '#FFC107', // Amber
    secondaryColor: '#8BC34A', // Light Green
    accentColor: '#FFEB3B', // Yellow
    textColor: '#1f2937',
    backgroundColor: '#ffffff',
  },
  
  // Royal Gold Green
  royalGoldGreen: {
    name: 'Royal Gold Green',
    primaryColor: '#FFA000', // Orange Amber
    secondaryColor: '#388E3C', // Green
    accentColor: '#FFC107', // Amber
    textColor: '#1f2937',
    backgroundColor: '#ffffff',
  },
  
  // Bright Taxi Theme
  brightTaxi: {
    name: 'Bright Taxi',
    primaryColor: '#FFEB3B', // Bright Yellow
    secondaryColor: '#66BB6A', // Light Green
    accentColor: '#FFC107', // Amber
    textColor: '#1f2937',
    backgroundColor: '#ffffff',
  },
};

// Get default theme
export const getDefaultTheme = () => premiumThemes.taxiYellowGreen;

// Apply theme to CSS variables
export const applyTheme = (theme) => {
  const root = document.documentElement;
  root.style.setProperty('--primary-color', theme.primaryColor);
  root.style.setProperty('--secondary-color', theme.secondaryColor);
  root.style.setProperty('--accent-color', theme.accentColor);
  root.style.setProperty('--text-color', theme.textColor);
  root.style.setProperty('--bg-color', theme.backgroundColor);
};

