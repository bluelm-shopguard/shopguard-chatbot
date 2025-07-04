/**
 * Theme Manager for ShopGuard AI
 * Handles theme switching and provides theme-related utilities
 */

// Theme definitions
var THEMES = {
  light: {
    id: 'light',
    name: '浅色模式',
    colors: {
      primary: '#007aff',
      background: '#f5f5f5',
      card: '#ffffff',
      text: '#333333',
      textSecondary: '#666666',
      border: '#e0e0e0'
    }
  },
  dark: {
    id: 'dark',
    name: '深色模式',
    colors: {
      primary: '#0a84ff',
      background: '#121212',
      card: '#1e1e1e',
      text: '#ffffff',
      textSecondary: '#aaaaaa',
      border: '#2c2c2c'
    }
  },
  // System theme follows device settings
  system: {
    id: 'system',
    name: '跟随系统'
  }
};

// ThemeManager class
function ThemeManager() {
  // Ensure themes is initialized
  this.themes = THEMES;
  
  // Default theme
  this.currentTheme = 'light';
  this.systemPrefersDark = false;
  
  // Log successful initialization
  console.log('ThemeManager initialized with themes:', Object.keys(this.themes).join(', '));
}

/**
 * Set the current theme
 * @param {string} themeId - Theme ID ('light', 'dark', 'system')
 */
ThemeManager.prototype.setTheme = function(themeId) {
  if (!this.themes[themeId]) {
    console.error('Theme not found:', themeId);
    return false;
  }
  
  this.currentTheme = themeId;
  return true;
};

/**
 * Get the current effective theme (resolves 'system' to actual theme)
 * @returns {string} - Effective theme ID ('light' or 'dark')
 */
ThemeManager.prototype.getEffectiveTheme = function() {
  if (this.currentTheme === 'system') {
    return this.systemPrefersDark ? 'dark' : 'light';
  }
  return this.currentTheme;
};

/**
 * Set the system preference for dark mode
 * @param {boolean} prefersDark - Whether system prefers dark mode
 */
ThemeManager.prototype.setSystemPreference = function(prefersDark) {
  this.systemPrefersDark = !!prefersDark;
  
  // If we're currently using system theme, we need to update the effective theme
  if (this.currentTheme === 'system') {
    console.log('System theme preference changed to:', prefersDark ? 'dark' : 'light');
    return true; // Signal that theme changed
  }
  
  return false; // Theme didn't change
};

/**
 * Get the theme data for the current theme
 * @returns {Object} - Theme data
 */
ThemeManager.prototype.getCurrentThemeData = function() {
  var effectiveTheme = this.getEffectiveTheme();
  return this.themes[effectiveTheme];
};

/**
 * Get all available themes
 * @returns {Array} - Array of theme objects
 */
ThemeManager.prototype.getAvailableThemes = function() {
  var result = [];
  
  for (var id in this.themes) {
    if (this.themes.hasOwnProperty(id)) {
      result.push({
        id: id,
        name: this.themes[id].name || id
      });
    }
  }
  
  return result;
};

/**
 * Get a CSS class name based on the current theme
 * @returns {string} - CSS class name for the current theme
 */
ThemeManager.prototype.getThemeClass = function() {
  var effectiveTheme = this.getEffectiveTheme();
  return effectiveTheme + '-theme';
};

/**
 * Get a color value from the current theme
 * @param {string} colorName - Name of the color (e.g., 'primary', 'background')
 * @returns {string} - Color value (hex code)
 */
ThemeManager.prototype.getColor = function(colorName) {
  var themeData = this.getCurrentThemeData();
  
  if (themeData && themeData.colors && themeData.colors[colorName]) {
    return themeData.colors[colorName];
  }
  
  // Default colors if not found
  var defaultColors = {
    primary: '#007aff',
    background: '#f5f5f5',
    card: '#ffffff',
    text: '#333333',
    textSecondary: '#666666',
    border: '#e0e0e0'
  };
  
  return defaultColors[colorName] || '#000000';
};

// Export the ThemeManager class
export { ThemeManager };
