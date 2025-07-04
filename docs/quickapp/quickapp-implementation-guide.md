# ShopGuard QuickApp: Practical Implementation Guide

This guide provides concrete examples and implementation details for converting the ShopGuard web-based chatbot to the QuickApp platform.

## Core Files Implementation

### 1. App Entry Point (app.ux)

```html
<script>
/**
 * ShopGuard AI - 购物防诈骗助手
 * QuickApp version entry point
 */

// Import helper modules
import './helper/global'

export default {
  onCreate() {
    console.log('App onCreate')
    
    // Initialize app
    const globalData = this.$def.globalData
    globalData.initUserSettings()
    globalData.initLanguage()
    globalData.initTheme()
  },
  
  // Method to show system toast
  showToast(message) {
    this.$def.prompt.showToast({
      message: message
    })
  }
}
</script>
```

### 2. Global Helper (helper/global.js)

```javascript
/**
 * Global utilities and shared functionality
 */

import storage from '@system.storage'
import prompt from '@system.prompt'
import fetch from '@system.fetch'
import device from '@system.device'

// Get global reference to inject utilities
function getGlobalRef() {
  return Object.getPrototypeOf(global) || global
}

const globalRef = getGlobalRef()

// Import helpers
import { loadUserSettings, getUserSetting, setUserSetting } from './user-settings'
import { getSystemSetting } from './system-settings'
import { LanguageManager, t } from './language-manager'
import { ThemeManager } from './theme-manager'

// Create instances of managers
const languageManager = new LanguageManager()
const themeManager = new ThemeManager()

// Global data and utilities
const globalData = {
  // Theme management
  theme: {
    current: 'light'
  },
  
  // Language management
  language: {
    current: 'zh-CN'
  },
  
  // User settings initialization
  async initUserSettings() {
    await loadUserSettings()
  },
  
  // Language initialization
  initLanguage() {
    const userLang = getUserSetting('language.default') || 'zh-CN'
    languageManager.setLanguage(userLang)
    this.language.current = userLang
  },
  
  // Theme initialization
  initTheme() {
    const userTheme = getUserSetting('theme.default') || 'light'
    themeManager.setTheme(userTheme)
    this.theme.current = userTheme
  },
  
  // Storage utilities
  async getStorage(key) {
    try {
      const result = await storage.get({ key })
      return result.data
    } catch (error) {
      console.error(`Error getting storage key ${key}:`, error)
      return null
    }
  },
  
  async setStorage(key, value) {
    try {
      await storage.set({ key, value: JSON.stringify(value) })
      return true
    } catch (error) {
      console.error(`Error setting storage key ${key}:`, error)
      return false
    }
  },
  
  // API communication
  async sendApiRequest(endpoint, data) {
    return new Promise((resolve, reject) => {
      fetch.fetch({
        url: endpoint,
        method: 'POST',
        data: data,
        header: {
          'Content-Type': 'application/json'
        },
        success: (response) => {
          try {
            const data = JSON.parse(response.data)
            resolve(data)
          } catch (error) {
            reject(error)
          }
        },
        fail: (error, code) => {
          reject({ error, code })
        }
      })
    })
  }
}

// Inject global utilities
globalRef.$t = t
globalRef.prompt = prompt
globalRef.globalData = globalData
```

### 3. Main Chat Page (pages/home/index.ux)

```html
<import name="chat-message" src="../../components/chat-message"></import>
<import name="sidebar-menu" src="../../components/sidebar"></import>

<template>
  <div class="chat-container">
    <!-- Header -->
    <div class="header">
      <div class="menu-button" onclick="toggleSidebar">
        <image src="/common/images/menu.png" class="menu-icon"></image>
      </div>
      <text class="app-title">{{ $t('app.title') }}</text>
      <div class="settings-button" onclick="openSettings">
        <image src="/common/images/settings.png" class="settings-icon"></image>
      </div>
    </div>
    
    <!-- Chat content -->
    <list class="message-list" id="messageList">
      <list-item type="message" for="{{messages}}">
        <chat-message content="{{$item.content}}" role="{{$item.role}}" timestamp="{{$item.timestamp}}"></chat-message>
      </list-item>
    </list>
    
    <!-- Input area -->
    <div class="input-area">
      <div class="attachments">
        <image src="/common/images/image.png" class="attachment-icon" onclick="uploadImage"></image>
      </div>
      <div class="input-wrap">
        <textarea class="message-input" placeholder="{{ $t('chat.inputPlaceholder') }}" 
          value="{{inputMessage}}" onchange="onInputChange" rows="1"></textarea>
        <div class="send-button" onclick="sendMessage">
          <image src="/common/images/send.png" class="send-icon"></image>
        </div>
      </div>
    </div>
    
    <!-- Sidebar -->
    <sidebar-menu id="sidebar" show="{{showSidebar}}" onclose="closeSidebar" 
      conversations="{{conversations}}" onclear="clearConversations" 
      onselect="selectConversation"></sidebar-menu>
  </div>
</template>

<script>
import router from '@system.router'
import prompt from '@system.prompt'
import storage from '@system.storage'
import media from '@system.media'
import { getSystemSetting } from '../../helper/system-settings'
import { getUserSetting } from '../../helper/user-settings'

export default {
  data() {
    return {
      messages: [],
      conversations: [],
      inputMessage: '',
      showSidebar: false,
      currentConversationId: null,
      isLoading: false
    }
  },
  
  onInit() {
    // Load welcome message
    this.messages.push({
      role: 'assistant',
      content: getSystemSetting('chat.welcomeMessage'),
      timestamp: Date.now()
    })
    
    // Load conversations
    this.loadConversations()
  },
  
  async loadConversations() {
    try {
      const data = await storage.get({ key: 'CONVERSATIONS' })
      if (data && data.data) {
        this.conversations = JSON.parse(data.data) || []
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
    }
  },
  
  toggleSidebar() {
    this.showSidebar = !this.showSidebar
  },
  
  closeSidebar() {
    this.showSidebar = false
  },
  
  onInputChange(e) {
    this.inputMessage = e.value
  },
  
  openSettings() {
    router.push({
      uri: 'pages/settings'
    })
  },
  
  async sendMessage() {
    if (!this.inputMessage.trim() || this.isLoading) return
    
    const userMessage = this.inputMessage
    this.inputMessage = ''
    
    // Add user message
    this.messages.push({
      role: 'user',
      content: userMessage,
      timestamp: Date.now()
    })
    
    this.isLoading = true
    
    try {
      // Call API
      const endpoint = getSystemSetting('api.endpoint')
      const modelName = getSystemSetting('api.model')
      
      // Prepare the chat messages in the OpenAI format
      const apiMessages = this.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
      
      const response = await globalData.sendApiRequest(endpoint, {
        model: modelName,
        messages: apiMessages
      })
      
      if (response && response.choices && response.choices[0]) {
        const assistantMessage = response.choices[0].message.content
        
        // Add assistant message
        this.messages.push({
          role: 'assistant',
          content: assistantMessage,
          timestamp: Date.now()
        })
        
        // Save conversation if history is enabled
        if (getUserSetting('chat.history.save')) {
          this.saveConversation()
        }
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('API error:', error)
      prompt.showToast({
        message: getSystemSetting('chat.errorMessage')
      })
    } finally {
      this.isLoading = false
      
      // Scroll to bottom
      this.$element('messageList').scrollTo({
        index: this.messages.length - 1
      })
    }
  },
  
  async uploadImage() {
    try {
      const result = await media.pickImage({
        fail: (data, code) => {
          console.error(`Error code: ${code}, Error info: ${data}`)
          return
        }
      })
      
      if (result && result.uri) {
        // Handle image upload logic
        this.inputMessage = `[上传了一张图片: ${result.uri}]`
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  },
  
  async saveConversation() {
    // Save current conversation to history
    if (!this.currentConversationId) {
      this.currentConversationId = Date.now().toString()
      
      // Extract first few words for title
      const firstMessage = this.messages.find(m => m.role === 'user')
      const title = firstMessage 
        ? (firstMessage.content.slice(0, 20) + (firstMessage.content.length > 20 ? '...' : ''))
        : '新对话'
      
      this.conversations.unshift({
        id: this.currentConversationId,
        title: title,
        timestamp: Date.now(),
        messages: [...this.messages]
      })
    } else {
      // Update existing conversation
      const index = this.conversations.findIndex(c => c.id === this.currentConversationId)
      if (index !== -1) {
        this.conversations[index].messages = [...this.messages]
        this.conversations[index].timestamp = Date.now()
      }
    }
    
    // Save to storage
    try {
      await storage.set({
        key: 'CONVERSATIONS',
        value: JSON.stringify(this.conversations)
      })
    } catch (error) {
      console.error('Error saving conversations:', error)
    }
  },
  
  clearConversations() {
    this.conversations = []
    storage.set({
      key: 'CONVERSATIONS',
      value: JSON.stringify([])
    })
  },
  
  selectConversation(e) {
    const convo = this.conversations.find(c => c.id === e.detail.id)
    if (convo) {
      this.messages = [...convo.messages]
      this.currentConversationId = convo.id
      this.closeSidebar()
    }
  },
  
  newConversation() {
    this.messages = [{
      role: 'assistant',
      content: getSystemSetting('chat.welcomeMessage'),
      timestamp: Date.now()
    }]
    this.currentConversationId = null
  }
}
</script>

<style lang="less">
.chat-container {
  flex-direction: column;
  height: 100%;
  background-color: #F2F2F7;
}

.header {
  height: 120px;
  padding: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #FFFFFF;
  
  .menu-button, .settings-button {
    width: 80px;
    height: 80px;
    justify-content: center;
    align-items: center;
  }
  
  .menu-icon, .settings-icon {
    width: 50px;
    height: 50px;
  }
  
  .app-title {
    flex: 1;
    text-align: center;
    font-size: 40px;
    font-weight: bold;
    color: #333;
  }
}

.message-list {
  flex: 1;
  padding: 20px;
}

.input-area {
  flex-direction: column;
  padding: 20px;
  background-color: #FFFFFF;
  border-top: 1px solid #E5E5EA;
  
  .attachments {
    height: 80px;
    flex-direction: row;
    align-items: center;
    
    .attachment-icon {
      width: 60px;
      height: 60px;
      margin-right: 20px;
    }
  }
  
  .input-wrap {
    flex-direction: row;
    align-items: center;
    
    .message-input {
      flex: 1;
      padding: 20px;
      font-size: 34px;
      background-color: #F2F2F7;
      border-radius: 20px;
      margin-right: 20px;
    }
    
    .send-button {
      width: 80px;
      height: 80px;
      border-radius: 40px;
      background-color: #007AFF;
      justify-content: center;
      align-items: center;
      
      .send-icon {
        width: 40px;
        height: 40px;
      }
    }
  }
}

</style>
```

### 4. Chat Message Component (components/chat-message.ux)

```html
<template>
  <div class="message {{role}}">
    <div class="message-content">
      <text class="message-text">{{content}}</text>
    </div>
    <text class="timestamp">{{formattedTime}}</text>
  </div>
</template>

<script>
export default {
  props: {
    role: {
      default: 'assistant'  // 'user' or 'assistant'
    },
    content: {
      default: ''
    },
    timestamp: {
      default: 0
    }
  },
  
  computed: {
    formattedTime() {
      if (!this.timestamp) return ''
      
      const date = new Date(this.timestamp)
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      return `${hours}:${minutes}`
    }
  }
}
</script>

<style lang="less">
.message {
  margin: 20px 0;
  flex-direction: column;
  
  &.user {
    align-items: flex-end;
    
    .message-content {
      background-color: #007AFF;
      border-radius: 18px 18px 4px 18px;
      
      .message-text {
        color: #FFFFFF;
      }
    }
  }
  
  &.assistant {
    align-items: flex-start;
    
    .message-content {
      background-color: #FFFFFF;
      border-radius: 18px 18px 18px 4px;
      
      .message-text {
        color: #000000;
      }
    }
  }
  
  .message-content {
    padding: 20px;
    max-width: 80%;
  }
  
  .message-text {
    font-size: 34px;
    line-height: 48px;
  }
  
  .timestamp {
    font-size: 24px;
    color: #8E8E93;
    margin-top: 8px;
  }
}
</style>
```

### 5. Sidebar Component (components/sidebar.ux)

```html
<template>
  <div class="sidebar-container {{show ? 'show' : ''}}">
    <div class="sidebar-overlay" onclick="close"></div>
    <div class="sidebar-content">
      <div class="sidebar-header">
        <text class="sidebar-title">{{ $t('sidebar.title') }}</text>
        <image src="/common/images/close.png" class="close-icon" onclick="close"></image>
      </div>
      
      <div class="actions">
        <div class="action-button new" onclick="newConversation">
          <image src="/common/images/new.png" class="action-icon"></image>
          <text>{{ $t('sidebar.newChat') }}</text>
        </div>
        <div class="action-button clear" onclick="clearHistory">
          <image src="/common/images/delete.png" class="action-icon"></image>
          <text>{{ $t('sidebar.clearHistory') }}</text>
        </div>
      </div>
      
      <list class="conversations-list">
        <list-item type="conversation" for="{{conversations}}">
          <div class="conversation-item" onclick="selectConversation($item.id)">
            <text class="conversation-title">{{$item.title}}</text>
            <text class="conversation-date">{{formatDate($item.timestamp)}}</text>
          </div>
        </list-item>
      </list>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      default: false
    },
    conversations: {
      default: []
    }
  },
  
  close() {
    this.$emit('close')
  },
  
  newConversation() {
    this.$emit('new')
    this.close()
  },
  
  clearHistory() {
    this.$emit('clear')
  },
  
  selectConversation(id) {
    this.$emit('select', { id })
  },
  
  formatDate(timestamp) {
    if (!timestamp) return ''
    
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    
    return `${year}-${month}-${day}`
  }
}
</script>

<style lang="less">
.sidebar-container {
  position: fixed;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  transition-property: left;
  transition-duration: 300ms;
  
  &.show {
    left: 0;
  }
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
}

.sidebar-content {
  position: fixed;
  top: 0;
  left: 0;
  width: 80%;
  height: 100%;
  background-color: #FFFFFF;
  flex-direction: column;
}

.sidebar-header {
  height: 120px;
  padding: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #E5E5EA;
  
  .sidebar-title {
    font-size: 40px;
    font-weight: bold;
    color: #333;
  }
  
  .close-icon {
    width: 50px;
    height: 50px;
  }
}

.actions {
  padding: 20px;
  flex-direction: row;
  justify-content: space-around;
  
  .action-button {
    flex-direction: column;
    align-items: center;
    
    .action-icon {
      width: 60px;
      height: 60px;
      margin-bottom: 10px;
    }
    
    text {
      font-size: 28px;
      color: #333;
    }
  }
}

.conversations-list {
  flex: 1;
}

.conversation-item {
  padding: 30px 20px;
  border-bottom: 1px solid #E5E5EA;
  
  .conversation-title {
    font-size: 34px;
    color: #333;
    margin-bottom: 10px;
  }
  
  .conversation-date {
    font-size: 28px;
    color: #8E8E93;
  }
}
</style>
```

### 6. Settings Page (pages/settings/index.ux)

```html
<template>
  <div class="settings-container">
    <div class="header">
      <div class="back-button" onclick="goBack">
        <image src="/common/images/back.png" class="back-icon"></image>
      </div>
      <text class="page-title">{{ $t('settings.title') }}</text>
    </div>
    
    <list class="settings-list">
      <!-- Theme Settings -->
      <list-item type="setting">
        <div class="setting-item">
          <text class="setting-label">{{ $t('settings.theme') }}</text>
          <div class="setting-value">
            <text>{{ getThemeName(currentTheme) }}</text>
          </div>
        </div>
      </list-item>
      
      <list-item type="theme-options">
        <div class="setting-options">
          <div for="{{themeOptions}}" tid="id" class="option {{$item.id === currentTheme ? 'selected' : ''}}" 
               onclick="changeTheme($item.id)">
            <text>{{$item.name}}</text>
          </div>
        </div>
      </list-item>
      
      <!-- Language Settings -->
      <list-item type="setting">
        <div class="setting-item">
          <text class="setting-label">{{ $t('settings.language') }}</text>
          <div class="setting-value">
            <text>{{ getLanguageName(currentLanguage) }}</text>
          </div>
        </div>
      </list-item>
      
      <list-item type="language-options">
        <div class="setting-options">
          <div for="{{languageOptions}}" tid="id" class="option {{$item.id === currentLanguage ? 'selected' : ''}}" 
               onclick="changeLanguage($item.id)">
            <text>{{$item.name}}</text>
          </div>
        </div>
      </list-item>
      
      <!-- Chat History Setting -->
      <list-item type="setting">
        <div class="setting-item">
          <text class="setting-label">{{ $t('settings.saveHistory') }}</text>
          <div class="setting-value">
            <switch checked="{{saveHistory}}" onchange="toggleSaveHistory"></switch>
          </div>
        </div>
      </list-item>
      
      <!-- About -->
      <list-item type="setting">
        <div class="setting-item" onclick="openAboutPage">
          <text class="setting-label">{{ $t('settings.about') }}</text>
          <div class="setting-value">
            <image src="/common/images/arrow-right.png" class="arrow-icon"></image>
          </div>
        </div>
      </list-item>
    </list>
  </div>
</template>

<script>
import router from '@system.router'
import { getUserSetting, setUserSetting } from '../../helper/user-settings'
import { ThemeManager } from '../../helper/theme-manager'
import { LanguageManager } from '../../helper/language-manager'

export default {
  data() {
    return {
      currentTheme: 'light',
      currentLanguage: 'zh-CN',
      saveHistory: true,
      themeOptions: [
        { id: 'light', name: '浅色模式' },
        { id: 'dark', name: '深色模式' },
        { id: 'system', name: '跟随系统' }
      ],
      languageOptions: [
        { id: 'zh-CN', name: '简体中文' },
        { id: 'en-US', name: 'English' }
      ]
    }
  },
  
  onInit() {
    // Load user settings
    this.currentTheme = getUserSetting('theme.default') || 'light'
    this.currentLanguage = getUserSetting('language.default') || 'zh-CN'
    this.saveHistory = getUserSetting('chat.history.save') !== false
  },
  
  goBack() {
    router.back()
  },
  
  getThemeName(themeId) {
    const theme = this.themeOptions.find(t => t.id === themeId)
    return theme ? theme.name : themeId
  },
  
  getLanguageName(langId) {
    const lang = this.languageOptions.find(l => l.id === langId)
    return lang ? lang.name : langId
  },
  
  async changeTheme(themeId) {
    this.currentTheme = themeId
    await setUserSetting('theme.default', themeId)
    
    // Apply theme
    const themeManager = new ThemeManager()
    themeManager.setTheme(themeId)
  },
  
  async changeLanguage(langId) {
    this.currentLanguage = langId
    await setUserSetting('language.default', langId)
    
    // Apply language
    const languageManager = new LanguageManager()
    languageManager.setLanguage(langId)
  },
  
  async toggleSaveHistory(e) {
    this.saveHistory = e.checked
    await setUserSetting('chat.history.save', e.checked)
  },
  
  openAboutPage() {
    router.push({
      uri: 'pages/about'
    })
  }
}
</script>

<style lang="less">
.settings-container {
  flex-direction: column;
  height: 100%;
  background-color: #F2F2F7;
}

.header {
  height: 120px;
  padding: 20px;
  flex-direction: row;
  align-items: center;
  background-color: #FFFFFF;
  
  .back-button {
    width: 80px;
    height: 80px;
    justify-content: center;
    align-items: center;
  }
  
  .back-icon {
    width: 50px;
    height: 50px;
  }
  
  .page-title {
    flex: 1;
    margin-left: 20px;
    font-size: 40px;
    font-weight: bold;
    color: #333;
  }
}

.settings-list {
  flex: 1;
}

.setting-item {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 30px 20px;
  background-color: #FFFFFF;
  margin-top: 20px;
  
  .setting-label {
    font-size: 34px;
    color: #333;
  }
  
  .setting-value {
    flex-direction: row;
    align-items: center;
    
    text {
      font-size: 34px;
      color: #8E8E93;
      margin-right: 10px;
    }
    
    .arrow-icon {
      width: 30px;
      height: 30px;
    }
  }
}

.setting-options {
  flex-direction: column;
  background-color: #FFFFFF;
  
  .option {
    padding: 30px 40px;
    border-top: 1px solid #E5E5EA;
    
    text {
      font-size: 34px;
      color: #333;
    }
    
    &.selected {
      text {
        color: #007AFF;
      }
    }
  }
}
</style>
```

### 7. Theme Manager (helper/theme-manager.js)

```javascript
/**
 * Theme management utilities for QuickApp
 * This module handles theme switching and initialization
 */
import device from '@system.device'
import { getUserSetting, setUserSetting } from './user-settings'
import { themeStyles } from './theme-styles'

export class ThemeManager {
  constructor() {
    this.currentTheme = 'light'
    this.init()
  }
  
  init() {
    // Get user's theme preference
    const userTheme = getUserSetting('theme.default') || 'light'
    this.setTheme(userTheme)
  }
  
  async getSystemTheme() {
    try {
      const info = await device.getInfo()
      return info.osTheme === 'dark' ? 'dark' : 'light'
    } catch (error) {
      console.error('Error getting system theme:', error)
      return 'light'
    }
  }
  
  async setTheme(themeName) {
    let finalTheme = themeName
    
    // Handle 'system' theme by getting the device theme
    if (themeName === 'system') {
      finalTheme = await this.getSystemTheme()
    }
    
    this.currentTheme = finalTheme
    this.applyTheme()
    
    return finalTheme
  }
  
  applyTheme() {
    // In QuickApp, we handle theme by updating CSS variables or class names
    // This is a simplified version - in real implementation, we would inject styles
    // or apply classes to key elements
    const theme = this.currentTheme
    const styles = themeStyles[theme] || themeStyles.light
    
    // For now, we'll use the global data to store current theme
    // Other components can check this when rendering
    if (globalData) {
      globalData.theme.current = theme
    }
    
    console.log(`Applied theme: ${theme}`)
  }
}

// Theme styles - simplified version
export const themeStyles = {
  light: {
    backgroundColor: '#F2F2F7',
    textColor: '#000000',
    accentColor: '#007AFF',
    cardBackground: '#FFFFFF',
    borderColor: '#E5E5EA'
  },
  dark: {
    backgroundColor: '#1C1C1E',
    textColor: '#FFFFFF',
    accentColor: '#0A84FF',
    cardBackground: '#2C2C2E',
    borderColor: '#38383A'
  }
}
```

## Application Manifest (manifest.json)

```json
{
  "package": "com.shopguard.quickapp",
  "name": "ShopGuard AI",
  "versionName": "1.0.0",
  "versionCode": 1,
  "icon": "/common/images/logo.jpeg",
  "minPlatformVersion": "1090",
  "features": [
    { "name": "system.prompt" },
    { "name": "system.router" },
    { "name": "system.storage" },
    { "name": "system.fetch" },
    { "name": "system.device" },
    { "name": "system.media" },
    { "name": "system.clipboard" }
  ],
  "permissions": [
    { "origin": "*" }
  ],
  "config": {
    "logLevel": "debug"
  },
  "router": {
    "entry": "pages/home",
    "pages": {
      "pages/home": {
        "component": "index"
      },
      "pages/settings": {
        "component": "index"
      },
      "pages/about": {
        "component": "index"
      }
    }
  },
  "display": {
    "titleBarBackgroundColor": "#f8f8f8",
    "titleBarTextColor": "#333333",
    "menu": true,
    "pages": {
      "pages/home": {
        "titleBarText": "ShopGuard AI"
      },
      "pages/settings": {
        "titleBarText": "设置"
      },
      "pages/about": {
        "titleBarText": "关于"
      }
    }
  }
}
```

## Key Differences from Web Version

1. **File Structure**: 
   - Web: HTML/CSS/JS separated
   - QuickApp: Combined in .ux files

2. **Component System**:
   - Web: DOM manipulation
   - QuickApp: Component-based (similar to Vue.js)

3. **Storage**:
   - Web: localStorage
   - QuickApp: @system.storage API

4. **Styling**:
   - Web: CSS
   - QuickApp: Less in <style> section

5. **Navigation**:
   - Web: Links and browser history
   - QuickApp: router.push() and router.back()

6. **API Calls**:
   - Web: fetch API
   - QuickApp: @system.fetch API

7. **Event Handling**:
   - Web: addEventListener
   - QuickApp: Declarative events (onclick, onchange, etc.)

## Testing Your Implementation

1. Use the QuickApp IDE to preview your application
2. Test on different device sizes
3. Validate all core functionality:
   - Chat messaging
   - Settings changes
   - Theme switching
   - Language switching
   - History management
   - Image upload (if implemented)

Remember that QuickApp performance can be different from web apps. Monitor CPU and memory usage during testing to ensure a smooth experience.
