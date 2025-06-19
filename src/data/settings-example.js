// settings : light/dark mode switch, about page
// more settings to be implemented: language (zh/en), user character (what does user want AI to know about him)
// below are some examples, rewrite maybe
export const AppSettings = {
  theme: {
    default: "light",
    options: [
      { id: "light", name: "浅色模式" },
      { id: "dark", name: "深色模式" },
      { id: "system", name: "跟随系统" },
    ],
  },
  webSearch: {
    enabled: true,
    provider: "google",
  },
  language: {
    default: "zh-CN",
    options: [
      { id: "zh-CN", name: "简体中文" },
      { id: "en-US", name: "English" },
    ],
  },
  // 可以在这里添加更多应用级别的设置
  // 例如：聊天记录、API Key 等
  chat: {
    history: {
      save: true,
      maxEntries: 100,
    },
  },
  api: {
    // 提醒：不要将敏感的 API 密钥直接硬编码在前端代码中。
    // 最好通过后端服务或安全的环境变量来管理。
    // 这里只是一个示例结构。
    key: null,
    endpoint: "https://api.example.com/chat",
  },
};

/**
 * 获取指定键的设置值。
 * @param {string} key - 设置项的键名，例如 'theme.default'。
 * @returns {*} 设置项的值，如果不存在则返回 undefined。
 */
export function getSetting(key) {
  if (!key) return undefined;

  const keys = key.split(".");
  let result = AppSettings;

  for (const k of keys) {
    if (result === undefined || result === null || typeof result !== "object") {
      return undefined;
    }
    result = result[k];
  }

  return result;
}

// 使用示例:
// import { getSetting } from './app/settings.js';
//
// const currentTheme = getSetting('theme.default');
// console.log(currentTheme); // 'light'
//
// const searchEnabled = getSetting('webSearch.enabled');
// console.log(searchEnabled); // true
