# Detailed WebApp to QuickApp Migration Guide for BlueLM Shopguard

This comprehensive guide outlines the process of migrating the BlueLM Shopguard chatbot from a traditional web application to a QuickApp. It provides specific technical details, code examples, and best practices for developers familiar with web technologies but new to QuickApp development.

## Table of Contents

1. [Project Structure Migration](#project-structure-migration)
2. [Core Files Conversion](#core-files-conversion)
3. [Component Transformation](#component-transformation)
4. [Data Management & API Integration](#data-management--api-integration)
5. [UI/UX Adaptation](#uiux-adaptation)
6. [Testing & Troubleshooting](#testing--troubleshooting)

## Project Structure Migration

### WebApp vs QuickApp Structure

| WebApp Structure | QuickApp Structure | Description |
|------------------|-------------------|-------------|
| `index.html`, `homepage.html` | `pages/home/index.ux` | Main application interface |
| `styles/*.css` files | `<style>` sections in `.ux` files | Styling now embedded in components |
| `js/*.js` modules | `helper/*.js` modules | Utility functions moved to helper directory |
| HTML components | `.ux` component files | Components are now self-contained |
| `localStorage` API | `@system.storage` API | Storage API replaced with QuickApp equivalent |

### Creating the QuickApp Structure

1. Create the basic directory structure:

```
mkdir -p src/pages/home src/pages/settings src/pages/about src/pages/history
mkdir -p src/components src/helper/i18n src/common/images src/common/styles
```

2. Set up the core configuration files:
   - `src/app.ux`: Main application entry point
   - `src/manifest.json`: Application configuration
   - `src/global.js`: Global utilities

## Core Files Conversion

### Converting HTML to UX

HTML files in the web application need to be transformed into UX files. Here's a systematic approach:

1. **Split HTML into Template, Script, and Style sections**:

   WebApp HTML:
   ```html
   <!DOCTYPE html>
   <html lang="zh-CN">
   <head>
     <meta charset="UTF-8">
     <link rel="stylesheet" href="styles/main.css">
     <title>BlueLM Shopguard</title>
   </head>
   <body>
     <div class="chat-container">
       <div id="message-list"></div>
       <div class="input-area">
         <input type="text" id="message-input" placeholder="发送消息...">
         <button id="send-button">发送</button>
       </div>
     </div>
     <script src="js/chat.js"></script>
   </body>
   </html>
   ```

   QuickApp UX:
   ```html
   <template>
     <div class="chat-container">
       <list id="message-list" class="message-list">
         <list-item for="{{messages}}">
           <!-- Message content -->
         </list-item>
       </list>
       <div class="input-area">
         <input type="text" placeholder="发送消息..." value="{{inputMessage}}" onchange="onInputChange">
         <div class="send-button" onclick="sendMessage">发送</div>
       </div>
     </div>
   </template>

   <script>
   export default {
     data: {
       messages: [],
       inputMessage: ''
     },
     
     onInputChange(e) {
       this.inputMessage = e.value
     },
     
     sendMessage() {
       // Send message logic
     }
   }
   </script>

   <style lang="less">
   .chat-container {
     flex-direction: column;
     height: 100%;
   }
   
   .message-list {
     flex: 1;
   }
   
   .input-area {
     flex-direction: row;
     padding: 10px;
   }
   </style>
   ```

2. **Handling DOM Manipulation**:

   WebApp JavaScript:
   ```javascript
   document.getElementById('send-button').addEventListener('click', () => {
     const input = document.getElementById('message-input');
     const message = input.value.trim();
     
     if (message) {
       addMessage('user', message);
       input.value = '';
       // Send to API...
     }
   });
   
   function addMessage(role, content) {
     const messageList = document.getElementById('message-list');
     const messageDiv = document.createElement('div');
     messageDiv.className = `message ${role}`;
     messageDiv.innerHTML = `<div class="message-content">${content}</div>`;
     messageList.appendChild(messageDiv);
   }
   ```

   QuickApp JavaScript:
   ```javascript
   export default {
     data: {
       messages: [],
       inputMessage: ''
     },
     
     onInputChange(e) {
       this.inputMessage = e.value
     },
     
     sendMessage() {
       const message = this.inputMessage.trim();
       
       if (message) {
         this.messages.push({
           role: 'user',
           content: message
         });
         
         this.inputMessage = '';
         // Send to API...
       }
     }
   }
   ```

3. **CSS to Less Migration**:

   WebApp CSS:
   ```css
   .message {
     margin: 10px 0;
   }
   
   .message.user {
     text-align: right;
   }
   
   .message.user .message-content {
     background-color: #007AFF;
     color: white;
   }
   
   .message.assistant .message-content {
     background-color: #F2F2F7;
     color: black;
   }
   
   .message-content {
     display: inline-block;
     padding: 10px 15px;
     border-radius: 18px;
     max-width: 80%;
   }
   ```

   QuickApp Less:
   ```less
   .message {
     margin: 10px 0;
     
     &.user {
       align-items: flex-end;
       
       .message-content {
         background-color: #007AFF;
         color: white;
       }
     }
     
     &.assistant {
       align-items: flex-start;
       
       .message-content {
         background-color: #F2F2F7;
         color: black;
       }
     }
     
     .message-content {
       padding: 10px 15px;
       border-radius: 18px;
       max-width: 80%;
     }
   }
   ```

## Component Transformation

QuickApp uses a component-based architecture similar to Vue.js. Here's how to transform web components:

### 1. Create Component Files

For each reusable UI element, create a separate `.ux` file in the `components` directory:

```
src/components/
  ├── chat-message.ux
  ├── input-box.ux
  ├── sidebar.ux
  └── header.ux
```

### 2. Define Component Props and Events

Each component should define its props (input) and events (output):

```html
<!-- components/chat-message.ux -->
<template>
  <div class="message {{role}}">
    <div class="content">
      <text>{{content}}</text>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: '',
    role: 'user' // 'user' or 'assistant'
  }
}
</script>
```

### 3. Import and Use Components

Import components in parent UX files:

```html
<import name="chat-message" src="../../components/chat-message"></import>

<template>
  <div class="container">
    <list>
      <list-item for="{{messages}}">
        <chat-message
          role="{{$item.role}}"
          content="{{$item.content}}"
        ></chat-message>
      </list-item>
    </list>
  </div>
</template>
```

## Data Management & API Integration

### 1. Local Storage to QuickApp Storage

WebApp:
```javascript
// Save settings
localStorage.setItem('userSettings', JSON.stringify(settings));

// Get settings
const settings = JSON.parse(localStorage.getItem('userSettings')) || {};
```

QuickApp:
```javascript
import storage from '@system.storage';

// Save settings
export async function saveUserSettings(settings) {
  try {
    await storage.set({
      key: 'USER_SETTINGS',
      value: JSON.stringify(settings)
    });
  } catch (error) {
    console.error('Storage error:', error);
  }
}

// Get settings
export async function getUserSettings() {
  try {
    const result = await storage.get({
      key: 'USER_SETTINGS'
    });
    
    if (result && result.data) {
      return JSON.parse(result.data);
    }
    return {};
  } catch (error) {
    console.error('Storage error:', error);
    return {};
  }
}
```

### 2. API Communication

WebApp:
```javascript
async function sendChatMessage(message) {
  try {
    const response = await fetch('https://api.example.com/v1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: message
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}
```

QuickApp:
```javascript
import fetch from '@system.fetch';

export function sendChatMessage(message) {
  return new Promise((resolve, reject) => {
    fetch.fetch({
      url: 'https://api.example.com/v1/chat',
      method: 'POST',
      data: {
        message: message
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function(response) {
        try {
          const data = JSON.parse(response.data);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      },
      fail: function(error, code) {
        reject({ error, code });
      }
    });
  });
}
```

## UI/UX Adaptation

### 1. Navigation

WebApp:
```html
<a href="settings.html">Settings</a>
```

QuickApp:
```javascript
import router from '@system.router';

// In component method
navigateToSettings() {
  router.push({
    uri: 'pages/settings'
  });
}
```

### 2. Dialog and Notifications

WebApp:
```javascript
alert('Message sent!');
// or
document.getElementById('notification').textContent = 'Message sent!';
document.getElementById('notification').style.display = 'block';
```

QuickApp:
```javascript
import prompt from '@system.prompt';

// Show toast notification
prompt.showToast({
  message: 'Message sent!'
});

// Show dialog
prompt.showDialog({
  title: 'Confirmation',
  message: 'Are you sure?',
  buttons: [
    {
      text: 'Cancel',
      color: '#999999'
    },
    {
      text: 'OK',
      color: '#0000ff'
    }
  ],
  success: function(data) {
    if (data.index === 1) {
      // User clicked OK
    }
  }
});
```

### 3. Responsive Design

WebApp:
```css
@media (max-width: 600px) {
  .sidebar {
    width: 100%;
  }
}
```

QuickApp:
```javascript
import device from '@system.device';

export default {
  data: {
    deviceWidth: 0,
    isMobileView: false
  },
  
  onInit() {
    device.getInfo({
      success: (info) => {
        this.deviceWidth = info.windowWidth;
        this.isMobileView = info.windowWidth < 600;
      }
    });
  }
}
```

```html
<template>
  <div class="sidebar" style="width: {{isMobileView ? '100%' : '300px'}}">
    <!-- Sidebar content -->
  </div>
</template>
```

## Testing & Troubleshooting

### 1. Setting Up the Test Environment

1. Install the QuickApp IDE from the official website
2. Import your project into the IDE
3. Use the built-in simulator to test your app
4. Connect a physical device for real-world testing

### 2. Common Issues and Solutions

#### CSS Layout Issues

**Problem**: Elements not displaying as expected in QuickApp compared to web browser.

**Solution**: QuickApp uses a flex-based layout system by default. Ensure that:

1. Container elements have explicit `flex-direction` (defaults to `column`)
2. Use `justify-content` and `align-items` for alignment
3. Specify dimensions (width/height) for elements that need them

```less
.container {
  flex-direction: column;  // or row
  justify-content: center; // main axis alignment
  align-items: center;     // cross axis alignment
}
```

#### API Communication Issues

**Problem**: Network requests failing or timing out.

**Solution**:

1. Add proper permissions in `manifest.json`:
```json
"features": [
  { "name": "system.fetch" }
],
"permissions": [
  { "origin": "*" }
]
```

2. Implement proper error handling:
```javascript
fetch.fetch({
  // ...request config
  success: function(response) {
    // Handle success
  },
  fail: function(error, code) {
    console.log(`Request failed with code ${code}`, error);
    // Show user-friendly error message
  },
  complete: function() {
    // Clean up, e.g., hide loading indicator
  }
});
```

#### Component Communication

**Problem**: Components not receiving updates or events.

**Solution**: Use props for parent-to-child communication and events for child-to-parent:

```html
<!-- Child component -->
<script>
export default {
  props: ['message'],
  
  sendReply() {
    this.$emit('reply', 'This is a reply');
  }
}
</script>

<!-- Parent component -->
<import name="child-comp" src="./child-component"></import>

<template>
  <child-comp message="{{parentMessage}}" onreply="handleReply"></child-comp>
</template>

<script>
export default {
  data: {
    parentMessage: 'Hello from parent'
  },
  
  handleReply(event) {
    console.log('Child replied:', event.detail);
  }
}
</script>
```

### 3. Performance Optimization

1. **Lazy Loading**: Load pages and resources only when needed
2. **Image Optimization**: Use appropriate image formats and sizes
3. **Component Reuse**: Create reusable components to improve maintainability
4. **Memory Management**: Clear large objects when no longer needed
5. **Avoid DOM Operations**: Use data-driven updates instead of direct DOM manipulation

## Conclusion

Migrating from a web application to a QuickApp requires careful planning and understanding of the platform differences. By following this guide, you can successfully transform your BlueLM Shopguard chatbot into a high-performance QuickApp while maintaining all its core functionalities.

Remember that QuickApp development combines the familiarity of web technologies with the performance benefits of native apps, offering the best of both worlds for developers and users alike.
