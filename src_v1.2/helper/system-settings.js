/**
 * System settings for ShopGuard AI
 * Contains default system configuration
 */

// System-wide constants
const SYSTEM = {
  APP_NAME: 'ShopGuard AI',
  VERSION: '1.0.0',
  BUILD_NUMBER: 1,
  DEBUG_MODE: false,
  API_TIMEOUT: 30000, // 30 seconds
  MAX_RETRY: 3,
  
  // API configuration
  API: {
    endpoint: 'http://118.31.112.51:8000/v1/chat/completions',
    model: 'vivo-BlueLM-TB-Pro',
  },
  
  // Chat configuration
  CHAT: {
    welcomeMessage: '遇到可疑商品、卖家或付款方式？随时发给我分析。无论是商品截图、链接还是聊天记录，我都会帮你识别风险，提供明确的"虚假诈骗风险星级"和建议，让我们一起安心购物不踩坑！',
    errorMessage: '抱歉，服务暂时不可用，请稍后再试。'
  }
}

/**
 * Get a system setting by key
 * @param {string} key - Path to the setting in dot notation (e.g., "API.endpoint")
 * @returns {*} The setting value or undefined if not found
 */
export function getSystemSetting(key) {
  if (!key) return undefined;
  const keys = key.split('.');
  let result = SYSTEM;
  for (const k of keys) {
    if (result === undefined || result === null || typeof result !== 'object') {
      return undefined;
    }
    result = result[k];
  }
  return result;
}

export default SYSTEM
