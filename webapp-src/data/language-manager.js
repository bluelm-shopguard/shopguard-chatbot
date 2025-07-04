/**
 * @file Language manager
 * @description Handles language switching and provides translation functionality
 */

import { getUserSetting } from "./user-settings.js";
import zhCN from "./i18n/zh-CN.js";
import enUS from "./i18n/en-US.js";

/**
 * @class LanguageManager
 * @description Manages application language and provides translation functionality
 */
export class LanguageManager {
  /**
   * @constructor
   * @description Creates a new LanguageManager instance and initializes with the user's language preference
   */
  constructor() {
    // Available language resources
    this.languages = {
      "zh-CN": zhCN,
      "en-US": enUS,
    };

    // Current language
    this.currentLanguage = "zh-CN"; // Default

    // Initialize
    this.init();
  }

  /**
   * @method init
   * @description Initializes language manager on page load and sets up event listeners
   */
  init() {
    try {
      // Verify language resources are loaded
      console.log("Language resources:", this.languages);

      // Load user's language preference
      const userLang = getUserSetting("language.default") || "zh-CN";
      console.log("User language preference:", userLang);

      this.setLanguage(userLang);

      // Listen for language changes from user settings
      this.setupSettingsListener();

      console.log("Language manager initialized successfully");
    } catch (error) {
      console.error("Error initializing language manager:", error);
    }
  }

  /**
   * @method setupSettingsListener
   * @description Sets up event listener for language changes from user settings
   */
  setupSettingsListener() {
    document.addEventListener("userSettingsChanged", (event) => {
      const { key, value } = event.detail;
      if (key === "language.default") {
        console.log("Language change detected from settings:", value);
        this.setLanguage(value);
      }
    });
  }

  /**
   * @method setLanguage
   * @param {string} lang - Language code to set (e.g., 'zh-CN', 'en-US')
   * @description Sets the current language and updates the UI
   */
  setLanguage(lang) {
    if (this.languages[lang]) {
      this.currentLanguage = lang;

      // Update HTML lang attribute
      document.documentElement.lang = lang;

      // Dispatch event for other components to react to language change
      document.dispatchEvent(
        new CustomEvent("languagechange", { detail: { language: lang } })
      );

      // Apply translations to the current page
      this.applyTranslations();

      return true;
    }

    console.warn(`Language '${lang}' not supported`);
    return false;
  }

  /**
   * @method applyTranslations
   * @description Applies translations to elements with data-i18n attributes
   */
  applyTranslations() {
    // Find all elements with data-i18n attribute
    const elements = document.querySelectorAll("[data-i18n]");

    elements.forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const translation = this.translate(key);

      if (translation) {
        // Handle different element types
        if (
          el.tagName === "INPUT" &&
          (el.type === "text" || el.type === "textarea")
        ) {
          if (el.placeholder) {
            el.placeholder = translation;
          } else {
            el.value = translation;
          }
        } else if (el.tagName === "IMG") {
          el.alt = translation;
        } else {
          el.textContent = translation;
        }
      }
    });

    // Handle page title
    const titleKey = document
      .querySelector('meta[name="i18n-title"]')
      ?.getAttribute("content");
    if (titleKey) {
      document.title = this.translate(titleKey) || document.title;
    }
  }

  /**
   * @method translate
   * @param {string} key - Translation key
   * @param {Object} [params] - Optional parameters for string interpolation
   * @returns {string} Translated string or key if translation not found
   * @description Translates a key to the current language
   */
  translate(key, params = {}) {
    if (!key) return "";

    const resources = this.languages[this.currentLanguage];
    if (!resources) {
      console.warn(
        `Language resources not found for '${this.currentLanguage}'`
      );
      return key;
    }

    const translation = resources[key];
    if (!translation) {
      console.warn(`Translation not found for key: '${key}'`);

      // Try fallback to default language (zh-CN) if current language is not the default
      if (this.currentLanguage !== "zh-CN" && this.languages["zh-CN"]) {
        const fallbackTranslation = this.languages["zh-CN"][key];
        if (fallbackTranslation) {
          console.log(`Using fallback translation for ${key} from zh-CN`);
          return fallbackTranslation;
        }
      }

      return key;
    }

    // Handle string interpolation if params provided
    if (Object.keys(params).length > 0) {
      return this.interpolate(translation, params);
    }

    return translation;
  }

  /**
   * @method getCurrentLanguage
   * @returns {string} Current language code
   * @description Gets the current language code
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  /**
   * @method interpolate
   * @private
   * @param {string} text - Text with placeholders
   * @param {Object} params - Parameters for interpolation
   * @returns {string} Interpolated text
   * @description Replaces placeholders in text with provided parameters
   */
  interpolate(text, params) {
    return text.replace(/{{\s*([^{}]*)\s*}}/g, (match, key) => {
      const value = params[key];
      return value !== undefined ? value : match;
    });
  }
}

// Create global language manager instance
export const languageManager = new LanguageManager();

// Export standalone translate function for easy access
export function t(key, params = {}) {
  return languageManager.translate(key, params);
}
