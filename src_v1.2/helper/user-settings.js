/**
 * User settings for ShopGuard AI
 * Default user preferences
 */

// Default user settings
const USER_SETTINGS = {
  theme: {
    default: 'light',
    options: [
      { id: 'light', name: '浅色模式' },
      { id: 'dark', name: '深色模式' },
      { id: 'system', name: '跟随系统' }
    ]
  },
  language: {
    default: 'zh-CN',
    options: [
      { id: 'zh-CN', name: '简体中文' },
      { id: 'en-US', name: 'English' }
    ]
  },
  chat: {
    history: {
      save: true,
      maxDays: 30
    }
  }
}

export default USER_SETTINGS
