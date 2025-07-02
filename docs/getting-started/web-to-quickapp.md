# 从网页版迁移到快应用

本指南将帮助开发者将 ShopGuard AI 聊天机器人从传统网页应用迁移到快应用平台。

## 迁移概述

将网页版应用迁移到快应用需要了解两个平台之间的主要差异，并对代码进行相应调整。

### 关键差异

| 网页应用 | 快应用 |
| ------- | ------ |
| HTML/CSS/JS | .ux 文件（类似 Vue 单文件组件） |
| DOM API | 快应用组件 API |
| 浏览器存储 | 快应用存储 API |
| 响应式设计 | 弹性布局 (Flex) |
| 事件模型 | 类似但有差异的事件系统 |

## 迁移步骤

### 1. 项目结构调整

快应用的项目结构与网页应用有所不同，需要按照快应用的要求重新组织文件：

```
src/
  ├── app.ux          # 应用入口
  ├── manifest.json   # 应用配置
  ├── common/         # 公共资源
  │   ├── images/     # 图片资源
  │   └── styles/     # 样式文件
  ├── components/     # 自定义组件
  └── pages/          # 页面组件
      ├── Home/       # 首页
      ├── Setting/    # 设置页
      └── About/      # 关于页
```

### 2. 组件转换

#### HTML 到 快应用模板转换

**网页版 HTML:**

```html
<div class="chat-app">
  <header class="chat-header">
    <button class="header-button open-sidebar-button" aria-label="Toggle sidebar">
      <i data-lucide="panel-left"></i>
    </button>
    <h1 class="chat-header__title">ShopGuard AI</h1>
  </header>
  <!-- ... 其他内容 ... -->
</div>
```

**快应用 UX:**

```html
<template>
  <div class="chat-app">
    <div class="chat-header">
      <image class="header-button" src="/common/images/icons/menu.png" onclick="openSidebar"></image>
      <text class="chat-header-title">ShopGuard AI</text>
    </div>
    <!-- ... 其他内容 ... -->
  </div>
</template>
```

#### CSS 转换

**网页版 CSS:**

```css
.chat-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 8px 16px;
}
```

**快应用 UX 样式:**

```html
<style>
  .chat-app {
    flex-direction: column;
    flex: 1;
  }
  
  .chat-header {
    flex-direction: row;
    align-items: center;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-left: 16px;
    padding-right: 16px;
  }
</style>
```

#### JavaScript 转换

**网页版 JS:**

```javascript
const sidebar = document.querySelector('.sidebar');
const openSidebarButton = document.querySelector('.open-sidebar-button');

function openSidebar() {
  sidebar.classList.add('active');
}

openSidebarButton.addEventListener('click', openSidebar);
```

**快应用 UX 脚本:**

```html
<script>
  export default {
    data: {
      sidebarActive: false
    },
    openSidebar() {
      this.sidebarActive = true
    }
  }
</script>
```

### 3. API 调用适配

#### 网页版 API 调用:

```javascript
async function callChatbotAPI(userInput, imageData) {
  const API_ENDPOINT = window.getSystemSetting('api.endpoint');
  
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
```

#### 快应用 API 调用:

```javascript
import fetch from '@system.fetch';

export default {
  async callChatbotAPI(userInput, imageData) {
    const API_ENDPOINT = this.$app.$def.getSystemSetting('api.endpoint');
    
    try {
      const response = await this.$app.$def.fetch({
        url: API_ENDPOINT,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify(requestBody)
      });
      
      const data = JSON.parse(response.data);
      return data.choices[0].message.content;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }
}
```

### 4. 存储机制转换

#### 网页版 存储:

```javascript
// 保存设置
localStorage.setItem('shopguard-user-settings', JSON.stringify(UserSettings));

// 读取设置
const saved = localStorage.getItem('shopguard-user-settings');
if (saved) {
  const savedSettings = JSON.parse(saved);
}
```

#### 快应用 存储:

```javascript
import storage from '@system.storage';

// 保存设置
storage.set({
  key: 'shopguard-user-settings',
  value: JSON.stringify(UserSettings),
  success: function() {
    console.log('Settings saved successfully');
  },
  fail: function(data, code) {
    console.error(`Failed to save settings: ${code}`);
  }
});

// 读取设置
storage.get({
  key: 'shopguard-user-settings',
  success: function(data) {
    if (data) {
      const savedSettings = JSON.parse(data);
      // 处理设置
    }
  },
  fail: function(data, code) {
    console.error(`Failed to read settings: ${code}`);
  }
});
```

## 常见问题与解决方案

### 图片处理差异

网页版中使用 FileReader API 处理图片上传，而快应用中应使用媒体 API：

```javascript
import media from '@system.media';

export default {
  pickImage() {
    media.pickImage({
      success: (data) => {
        this.currentImageData = data.uri;
      },
      fail: (data, code) => {
        console.error(`Failed to pick image: ${code}`);
      }
    });
  }
}
```

### 样式差异

快应用不支持某些 CSS 属性和选择器，需要使用替代方案：

1. 不支持伪类选择器（如 `:hover`），使用 JS 事件代替
2. 盒模型差异 - 需要使用 `margin-x` 和 `padding-x` 替代简写形式
3. 不支持全局样式，所有样式必须在组件内定义

### 路由处理

网页版使用 `href` 进行页面跳转，快应用使用路由 API：

```javascript
import router from '@system.router';

export default {
  goToSettings() {
    router.push({
      uri: '/pages/Setting'
    });
  }
}
```

## 测试与调试

1. 使用快应用预览工具进行实时预览
2. 通过控制台日志进行调试
3. 检查组件生命周期事件

## 最佳实践

1. 先完成核心功能转换，再处理次要特性
2. 使用模块化方法组织代码
3. 遵循快应用性能优化建议
4. 减少 DOM 操作，使用数据绑定
5. 在转换过程中持续测试各个功能点

## 参考资源

- [快应用官方文档](https://doc.quickapp.cn/)
- [快应用开发工具](https://www.quickapp.cn/docCenter/IDEPublicity)
- [快应用组件与接口](https://doc.quickapp.cn/features/)
