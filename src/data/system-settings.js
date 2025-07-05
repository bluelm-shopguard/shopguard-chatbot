/**
 * System configuration settings
 * @module system-settings
 * @description Core configuration settings for the application.
 * These settings can be modified directly in this file for different environments.
 * This IS the configuration file - no need for additional config files.
 */

/**
 * @typedef {Object} SystemSettingsObject
 * @property {Object} api - API configuration
 * @property {string} api.endpoint - API endpoint URL
 * @property {string} api.model - Model name to use
 * @property {number} api.timeout - API request timeout in milliseconds
 * @property {number} api.maxRetries - Maximum number of API request retries
 * @property {Object} app - Application settings
 * @property {string} app.name - Application name
 * @property {string} app.version - Application version
 * @property {string} app.environment - Environment (development, staging, production)
 * @property {Object} features - Feature flags
 * @property {boolean} features.webSearch - Whether web search is enabled
 * @property {boolean} features.fileUpload - Whether file upload is enabled
 * @property {boolean} features.chatHistory - Whether chat history is enabled
 * @property {Object} chat - Chat settings
 * @property {string} chat.welcomeMessage - Welcome message shown to users
 * @property {string} chat.errorMessage - Error message shown when API fails
 */

/** @type {SystemSettingsObject} */
export let SystemSettings = {
  api: {
    endpoint: "http://localhost:8000/v1/chat/completions",
    model: "vivo-BlueLM-TB-Pro",
    timeout: 30000, // 30 seconds
    maxRetries: 3,
  },
  app: {
    name: "ShopGuard AI",
    version: "1.0.0",
    environment: "development", // development, staging, production
  },
  features: {
    webSearch: true,
    fileUpload: true,
    chatHistory: true,
  },
  chat: {
    welcomeMessage:
      '遇到可疑商品、卖家或付款方式？随时发给我分析。无论是商品截图、链接还是聊天记录，我都会帮你识别风险，提供明确的"虚假诈骗风险星级"和建议，让我们一起安心购物不踩坑！',
    errorMessage: "抱歉，服务暂时不可用，请稍后再试。",
  },
};

/**
 * Get a system setting by key
 * @param {string} key - Dot notation path to the setting (e.g., "api.endpoint")
 * @returns {*} The setting value or undefined if not found
 * @example
 * const apiUrl = getSystemSetting("api.endpoint");
 */
export function getSystemSetting(key) {
  if (!key) return undefined;
  const keys = key.split(".");
  let result = SystemSettings;
  for (const k of keys) {
    if (result === undefined || result === null || typeof result !== "object") {
      return undefined;
    }
    result = result[k];
  }
  return result;
}

/**
 * Set a system setting by key
 * @param {string} key - Dot notation path to the setting (e.g., "api.endpoint")
 * @param {*} value - Value to set
 * @example
 * setSystemSetting("api.endpoint", "https://api.example.com/v1");
 */
export function setSystemSetting(key, value) {
  if (!key) return;
  const keys = key.split(".");
  let setting = SystemSettings;
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
  console.log(`System setting updated: ${key} =`, value);

  // Dispatch event for other components to react to system setting changes
  document.dispatchEvent(
    new CustomEvent("systemSettingsChanged", {
      detail: { key, value },
    })
  );
}
