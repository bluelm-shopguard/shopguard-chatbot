/**
 * User preferences settings module
 * @module user-settings
 * @description Handles user preferences that can be modified through the UI and persisted to localStorage
 */

/**
 * @typedef {Object} UserSettingsObject
 * @property {Object} theme - Theme settings
 * @property {string} theme.default - Default theme ('light', 'dark', or 'system')
 * @property {Array} theme.options - Available theme options
 * @property {Object} language - Language settings
 * @property {string} language.default - Default language
 * @property {Array} language.options - Available language options
 * @property {Object} chat - Chat settings
 * @property {Object} chat.history - Chat history settings
 * @property {boolean} chat.history.save - Whether to save chat history
 */

/** @type {UserSettingsObject} */
export let UserSettings = {
  theme: {
    default: "light",
    options: [
      { id: "light", name: "浅色模式" },
      { id: "dark", name: "深色模式" },
      { id: "system", name: "跟随系统" },
    ],
  },
  language: {
    default: "zh-CN",
    options: [
      { id: "zh-CN", name: "简体中文" },
      { id: "en-US", name: "English" },
      // TODO: English language support to be implemented
    ],
  },
  chat: {
    history: {
      save: true,
    },
  },
};

// Track if theme changed to avoid circular imports
let themeChanged = false;

/**
 * Get a user setting by key
 * @param {string} key - Dot notation path to the setting
 * @returns {*} The setting value or undefined if not found
 */
export function getUserSetting(key) {
  if (!key) return undefined;
  const keys = key.split(".");
  let result = UserSettings;
  for (const k of keys) {
    if (result === undefined || result === null || typeof result !== "object") {
      return undefined;
    }
    result = result[k];
  }
  return result;
}

/**
 * Set a user setting by key
 * @param {string} key - Dot notation path to the setting
 * @param {*} value - Value to set
 */
export function setUserSetting(key, value) {
  if (!key) return;
  const keys = key.split(".");
  let setting = UserSettings;
  for (let i = 0; i < keys.length - 1; i++) {
    if (
      setting[keys[i]] === undefined ||
      typeof setting[keys[i]] !== "object"
    ) {
      setting[keys[i]] = {};
    }
    setting = setting[keys[i]];
  }
  setting[keys[keys.length - 1]] = value;
  console.log("User settings updated:", key, value);

  // Save to localStorage
  try {
    localStorage.setItem(
      "shopguard-user-settings",
      JSON.stringify(UserSettings)
    );

    // If theme setting changed, flag it for later processing to avoid circular dependencies
    if (key === "theme.default") {
      themeChanged = true;
      // Theme changes are now handled by DOM event listeners in theme-manager.js
      document.dispatchEvent(
        new CustomEvent("userSettingsChanged", {
          detail: { key, value },
        })
      );
    }
  } catch (error) {
    console.warn("Failed to save user settings to localStorage:", error);
  }
}

/**
 * Load user settings from localStorage on initialization
 */
export function loadUserSettings() {
  try {
    const saved = localStorage.getItem("shopguard-user-settings");
    if (saved) {
      const savedSettings = JSON.parse(saved);
      // Deep merge saved settings with defaults
      mergeSettings(UserSettings, savedSettings);
    }
  } catch (error) {
    console.warn("Failed to load user settings from localStorage:", error);
  }
}

/**
 * Deep merge source object into target object
 * @param {Object} target - Target object
 * @param {Object} source - Source object
 * @private
 */
function mergeSettings(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && key in target) {
      mergeSettings(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
}

// Initialize user settings on module load
loadUserSettings();
