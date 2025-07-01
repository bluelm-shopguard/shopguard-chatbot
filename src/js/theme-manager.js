// Theme management utilities
// This module handles theme switching and initialization

export class ThemeManager {
  constructor() {
    this.init();
  }

  init() {
    // Initialize theme on page load
    this.applyTheme();

    // Listen for system theme changes when user has "system" preference
    this.setupSystemThemeListener();
  }

  applyTheme() {
    const theme = this.getCurrentTheme();
    const html = document.documentElement;

    // Remove existing theme classes
    html.removeAttribute("data-theme");

    // Apply new theme
    if (theme === "dark") {
      html.setAttribute("data-theme", "dark");
    }
    // For 'light' and 'system' (when system is light), don't set data-theme
    // This uses the default CSS variables defined in :root
  }

  getCurrentTheme() {
    // Get user's theme preference
    const userTheme = this.getUserThemePreference();

    if (userTheme === "system") {
      // Use system preference
      return this.getSystemTheme();
    }

    return userTheme || "light";
  }

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

  getSystemTheme() {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  }

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

// Export convenience functions
export function setTheme(theme) {
  themeManager.setTheme(theme);
}

export function getCurrentTheme() {
  return themeManager.getCurrentTheme();
}

export function applyTheme() {
  themeManager.applyTheme();
}
