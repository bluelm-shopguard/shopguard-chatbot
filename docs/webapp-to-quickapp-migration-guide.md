# Web to QuickApp Migration Guide: ShopGuard Chatbot

This guide outlines the steps to convert the ShopGuard web-based chatbot to a QuickApp format. It's designed for developers who are familiar with web development but new to QuickApp development.

## Table of Contents

1. [Project Structure Comparison](#project-structure-comparison)
2. [QuickApp Basics](#quickapp-basics)
3. [File Conversion Guide](#file-conversion-guide)
4. [Components Transformation](#components-transformation)
5. [Data Management](#data-management)
6. [UI/UX Adaptation](#uiux-adaptation)
7. [API Integration](#api-integration)
8. [Testing and Deployment](#testing-and-deployment)

## Project Structure Comparison

### Web Project Structure (Current)

```
shopguard-chatbot/
├── src/
│   ├── homepage.html             # Main application page
│   ├── test-settings.html        # Settings test page
│   ├── common/                   # Common assets
│   │   ├── images/               # Image resources
│   │   └── styles/               # CSS stylesheets
│   ├── data/                     # Data management
│   │   ├── i18n/                 # Internationalization
│   │   ├── language-manager.js   # Language handling
│   │   ├── system-settings.js    # System settings
│   │   └── user-settings.js      # User settings
│   ├── js/                       # JavaScript modules
│   │   └── theme-manager.js      # Theme handling
│   └── pages/                    # Additional pages
```

### QuickApp Project Structure (Target)

```
shopguard-chatbot/
├── src/
│   ├── app.ux                    # Main application entry point
│   ├── manifest.json             # App configuration
│   ├── common/                   # Common assets
│   │   ├── images/               # Image resources
│   │   └── styles/               # Less stylesheets
│   ├── helper/                   # Utility modules
│   │   ├── i18n/                 # Internationalization
│   │   ├── language-manager.js   # Language handling
│   │   ├── system-settings.js    # System settings
│   │   └── user-settings.js      # User settings
│   ├── components/               # Reusable components
│   │   ├── chat-message.ux       # Message component
│   │   ├── sidebar.ux           # Sidebar component
│   │   └── input-box.ux         # Input component
│   └── pages/                    # Application pages
│       ├── home/                 # Main chat interface
│       │   └── index.ux
│       ├── settings/             # Settings page
│       │   └── index.ux
│       └── about/                # About page
│           └── index.ux
```

## QuickApp Basics

QuickApp uses special `.ux` files that combine HTML, CSS, and JavaScript in a single file with distinct sections:

```html
<template>
  <!-- HTML markup goes here -->
</template>

<script>
// JavaScript code goes here
export default {
  data() {
    return {
      // Component data
    }
  },
  // Lifecycle hooks and methods
}
</script>

<style lang="less">
/* CSS/Less styles go here */
</style>
```

Key differences from web development:

1. File structure: Single `.ux` file contains markup, logic, and styles
2. Component model: Similar to Vue.js but with QuickApp-specific APIs
3. Navigation: Uses `router` module instead of links
4. Storage: Uses `@system.storage` instead of localStorage
5. Styling: Supports LESS but has some limitations compared to web CSS

## File Conversion Guide

### Converting HTML files to UX

Each HTML page should be converted to a separate QuickApp page:

1. `homepage.html` → `pages/home/index.ux`
2. `test-settings.html` → `pages/settings/index.ux`

The conversion process follows this pattern:

1. Extract HTML structure to `<template>` section
2. Convert inline JavaScript to the `<script>` section
3. Move CSS to the `<style lang="less">` section
4. Replace web-specific elements with QuickApp equivalents

### JavaScript Conversion

1. ES modules → QuickApp import system
2. DOM manipulation → QuickApp component methods
3. Event listeners → QuickApp event handling
4. Web APIs → QuickApp system APIs

### CSS/Styling Conversion

1. CSS → LESS format (QuickApp prefers LESS)
2. Web-specific properties → QuickApp styling system
3. Media queries → Responsive design patterns in QuickApp
4. CSS animations → QuickApp animation system

## Components Transformation

### Chat Message Component

Web version:
```html
<div class="message user">
  <div class="message-content">
    <p>Hello, how can I protect myself from shopping scams?</p>
  </div>
</div>
```

QuickApp version (`components/chat-message.ux`):
```html
<template>
  <div class="message {{type}}">
    <div class="message-content">
      <text>{{content}}</text>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: '',
    type: 'user' // 'user' or 'assistant'
  }
}
</script>

<style lang="less">
.message {
  margin: 10px 0;
  
  &.user {
    align-self: flex-end;
    
    .message-content {
      background-color: #007AFF;
      color: #FFFFFF;
    }
  }
  
  &.assistant {
    align-self: flex-start;
    
    .message-content {
      background-color: #F2F2F7;
      color: #000000;
    }
  }
  
  .message-content {
    padding: 10px 15px;
    border-radius: 18px;
    max-width: 80%;
  }
}
</style>
```

### Sidebar Component

Web version uses DOM manipulation and event listeners. In QuickApp, we'll use component props and events.

## Data Management

### System Settings

Convert to QuickApp format by adapting the existing system-settings.js:

```javascript
// From helper/system-settings.js
import storage from '@system.storage'

export const SystemSettings = {
  api: {
    endpoint: "http://localhost:8000/v1/chat/completions",
    model: "vivo-BlueLM-TB-Pro",
    timeout: 30000,
    maxRetries: 3,
  },
  // other settings...
}

// Get a system setting by key path (using dot notation)
export function getSystemSetting(key) {
  return key.split('.').reduce((obj, k) => obj && obj[k], SystemSettings)
}
```

### User Settings

Adapt user settings to use QuickApp's storage system:

```javascript
// From helper/user-settings.js
import storage from '@system.storage'

// Default settings
export const DefaultUserSettings = {
  theme: {
    default: "light",
    options: [
      { id: "light", name: "浅色模式" },
      { id: "dark", name: "深色模式" },
      { id: "system", name: "跟随系统" },
    ]
  },
  // other defaults...
}

// Current settings (will be loaded from storage)
let userSettings = { ...DefaultUserSettings }

// Load settings from storage
export async function loadUserSettings() {
  try {
    const storedSettings = await storage.get({ key: 'USER_SETTINGS' })
    if (storedSettings && storedSettings.data) {
      userSettings = JSON.parse(storedSettings.data)
    }
  } catch (error) {
    console.error('Error loading user settings:', error)
    // Initialize with defaults if needed
    await saveUserSettings()
  }
}

// Save settings to storage
export async function saveUserSettings() {
  try {
    await storage.set({
      key: 'USER_SETTINGS',
      value: JSON.stringify(userSettings)
    })
  } catch (error) {
    console.error('Error saving user settings:', error)
  }
}

// Get a user setting by key path
export function getUserSetting(key) {
  return key.split('.').reduce((obj, k) => obj && obj[k], userSettings)
}

// Set a user setting by key path
export async function setUserSetting(key, value) {
  const parts = key.split('.')
  const lastKey = parts.pop()
  const target = parts.reduce((obj, k) => obj[k] = obj[k] || {}, userSettings)
  target[lastKey] = value
  await saveUserSettings()
}
```

## UI/UX Adaptation

### Chat Interface

The main chat interface needs to be adapted to QuickApp components:

```html
<template>
  <div class="chat-container">
    <!-- Message list -->
    <list class="message-list">
      <list-item for="{{messages}}">
        <chat-message content="{{$item.content}}" type="{{$item.role}}"></chat-message>
      </list-item>
    </list>
    
    <!-- Input area -->
    <div class="input-area">
      <input class="message-input" type="text" placeholder="输入消息..." value="{{inputMessage}}" onchange="handleInputChange"></input>
      <div class="send-button" onclick="sendMessage">
        <text>发送</text>
      </div>
    </div>
  </div>
</template>

<script>
import router from '@system.router'
import prompt from '@system.prompt'
import { sendChatMessage } from '../../helper/api'

export default {
  data() {
    return {
      messages: [],
      inputMessage: ''
    }
  },
  
  onInit() {
    // Initialize chat with welcome message
  },
  
  handleInputChange(e) {
    this.inputMessage = e.value
  },
  
  async sendMessage() {
    if (!this.inputMessage.trim()) return
    
    // Add user message
    this.messages.push({
      role: 'user',
      content: this.inputMessage
    })
    
    const userMessage = this.inputMessage
    this.inputMessage = ''
    
    try {
      // Call API and handle response
      const response = await sendChatMessage(userMessage)
      
      this.messages.push({
        role: 'assistant',
        content: response.message
      })
    } catch (error) {
      prompt.showToast({
        message: '发送消息失败，请重试'
      })
    }
  }
}
</script>
```

## API Integration

QuickApp uses the `fetch` module for HTTP requests:

```javascript
// helper/api.js
import fetch from '@system.fetch'
import { getSystemSetting } from './system-settings'

export async function sendChatMessage(message) {
  const endpoint = getSystemSetting('api.endpoint')
  const model = getSystemSetting('api.model')
  
  return new Promise((resolve, reject) => {
    fetch.fetch({
      url: endpoint,
      method: 'POST',
      data: {
        model: model,
        messages: [
          { role: 'user', content: message }
        ]
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (response) => {
        try {
          const data = JSON.parse(response.data)
          resolve({
            message: data.choices[0].message.content,
            model: data.model
          })
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
```

## Testing and Deployment

1. Use the QuickApp IDE for testing
2. Test on different device sizes
3. Optimize for performance
4. Package for distribution

Remember that QuickApp has a different lifecycle and user experience than web applications. Always test thoroughly on actual devices or emulators to ensure proper functionality.
