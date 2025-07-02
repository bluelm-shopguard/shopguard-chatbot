// Theme management utilities
// This module handles theme switching and initialization
/**
 * @class ThemeManager
 * @description Manages application theme (light/dark/system) by handling user preferences
 * and system settings. Provides methods to get, set and apply themes consistently.
 */
export class ThemeManager {
  /**
   * @constructor
   * @description Creates a new ThemeManager instance and initializes the theme
   */
  constructor() {
    this.init();
  }

  /**
   * @method init
   * @description Initializes theme on page load and sets up event listeners
   */
  init() {
    // Initialize theme on page load
    this.applyTheme();

    // Listen for system theme changes when user has "system" preference
    this.setupSystemThemeListener();
  }

  /**
   * @method applyTheme
   * @description Applies the current theme to the document
   */
  applyTheme() {
    const theme = this.getCurrentTheme();
    const html = document.documentElement;

    // Remove existing theme classes
    html.removeAttribute("data-theme");

    // Apply new theme
    html.setAttribute("data-theme", theme);

    // Dispatch event for other components to react to theme change
    document.dispatchEvent(
      new CustomEvent("themechange", { detail: { theme } })
    );
  }

  /**
   * @method getCurrentTheme
   * @returns {string} The current theme ('light', 'dark', or system-determined value)
   * @description Gets the current theme based on user preference or system setting
   */
  getCurrentTheme() {
    // Get user's theme preference
    const userTheme = this.getUserThemePreference();

    if (userTheme === "system") {
      // Use system preference
      return this.getSystemTheme();
    }

    return userTheme || "light";
  }

  /**
   * @method getUserThemePreference
   * @returns {string} User's theme preference
   * @description Retrieves the user's theme preference from localStorage
   */
  getUserThemePreference() {
    try {
      const settings = localStorage.getItem("shopguard-user-settings");
      if (settings) {
        const parsed = JSON.parse(settings);
        return parsed.theme?.default;
      }
    } catch (error) {
      console.warn("Failed to get user theme preference:", error);
    }
    return "light";
  }

  /**
   * @method getSystemTheme
   * @returns {string} System theme ('light' or 'dark')
   * @description Detects the system theme preference
   */
  getSystemTheme() {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  }

  /**
   * @method setupSystemThemeListener
   * @description Sets up a listener for system theme changes
   */
  setupSystemThemeListener() {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", () => {
        // Only apply if user has "system" preference
        if (this.getUserThemePreference() === "system") {
          this.applyTheme();
        }
      });
    }
  }

  /**
   * @method setTheme
   * @param {string} theme - The theme to set ('light', 'dark', or 'system')
   * @description Sets the user's theme preference and applies it
   */
  setTheme(theme) {
    // Update the theme preference in user settings
    try {
      const settings = JSON.parse(
        localStorage.getItem("shopguard-user-settings") || "{}"
      );
      if (!settings.theme) {
        settings.theme = {};
      }
      settings.theme.default = theme;
      localStorage.setItem("shopguard-user-settings", JSON.stringify(settings));

      // Apply the theme immediately
      this.applyTheme();
    } catch (error) {
      console.warn("Failed to save theme preference:", error);
    }
  }
}

// Create global theme manager instance
export const themeManager = new ThemeManager();

// Export standalone apply function to avoid circular dependencies
export function applyTheme() {
  themeManager.applyTheme();
}
