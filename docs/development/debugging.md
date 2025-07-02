# 调试技巧

本文档提供了在开发 ShopGuard AI 聊天机器人过程中，针对网页版和快应用版的调试技巧、工具和最佳实践。

## 网页版调试

### 浏览器开发者工具

浏览器内置的开发者工具是调试网页版应用的主要工具。

#### 打开开发者工具

- **Chrome/Edge**: F12 或 Ctrl+Shift+I (Windows/Linux) 或 Cmd+Option+I (Mac)
- **Firefox**: F12 或 Ctrl+Shift+I
- **Safari**: Cmd+Option+I

#### 控制台调试

使用 `console` 方法在关键位置添加日志：

```javascript
// 基本日志
console.log('消息发送成功', data);

// 警告日志
console.warn('配置不完整，使用默认值');

// 错误日志
console.error('API 调用失败', error);

// 分组日志（便于组织复杂信息）
console.group('用户操作');
console.log('用户点击：发送按钮');
console.log('消息内容:', message);
console.groupEnd();

// 带样式的日志
console.log('%c重要消息', 'color: red; font-weight: bold', '发现可疑内容');

// 计时操作
console.time('API 调用');
await callChatbotAPI(message);
console.timeEnd('API 调用');
```

#### 网络监控

使用开发者工具的 Network 选项卡监控 API 请求：

1. 打开开发者工具，切换到 Network 选项卡
2. 筛选 XHR/Fetch 请求
3. 检查请求头、请求体、响应和状态码
4. 使用 "Preserve log" 选项在页面刷新后保留请求历史

#### DOM 检查

使用 Elements 选项卡检查和修改 DOM 结构：

1. 查看元素层次结构
2. 实时编辑 CSS 样式
3. 检查元素可访问性属性
4. 使用 `:hov` 按钮模拟悬停等状态

### 本地存储调试

检查和修改 localStorage 中的应用数据：

1. 打开开发者工具，切换到 Application 选项卡
2. 展开左侧的 Storage > Local Storage
3. 选择应用域名
4. 查看、编辑或删除存储的键值对

```javascript
// 在控制台中查看所有本地存储数据
Object.keys(localStorage).filter(key => key.startsWith('shopguard')).forEach(key => {
  console.log(key, JSON.parse(localStorage.getItem(key)));
});
```

### 断点调试

在代码中设置断点以逐步执行：

1. 在开发者工具的 Sources 选项卡中找到源文件
2. 点击行号设置断点
3. 执行会导致该代码运行的操作
4. 使用调试控制器逐步执行代码
5. 检查变量值和调用堆栈

还可以使用代码断点：

```javascript
function sendMessage() {
  const prompt = inputArea.textContent.trim();
  
  // 设置条件断点
  if (prompt.includes('debug')) {
    debugger; // 执行到这里时会暂停
  }
  
  // 继续处理...
}
```

### 性能分析

使用 Performance 选项卡分析应用性能：

1. 点击记录按钮开始性能分析
2. 执行要分析的操作
3. 停止记录并分析结果
4. 查找长任务、布局偏移和渲染问题

### 移动设备调试

使用远程调试工具连接移动设备：

**Android + Chrome**:
1. 在设备上启用 USB 调试
2. 使用 USB 连接到计算机
3. 在 Chrome 中访问 `chrome://inspect`
4. 选择已连接设备上运行的页面

**iOS + Safari**:
1. 在 iOS 设备上启用 Web 检查器
2. 连接设备到 Mac
3. 在 Safari > 开发菜单中选择设备和页面

## 快应用调试

### 快应用开发工具

使用官方提供的快应用开发者工具：

1. 安装快应用预览版和调试器
2. 连接设备并启用调试模式
3. 在开发工具中构建并部署应用
4. 使用调试器连接运行中的应用

### 日志输出

在快应用中使用 `console` API 输出日志：

```javascript
console.log('快应用日志');
console.info('信息日志');
console.warn('警告日志');
console.error('错误日志');
```

查看日志的方法：
- 通过 IDE 的日志面板
- 通过快应用调试器查看
- 使用 `adb logcat` 命令行工具

### 调试弹窗

在关键位置使用弹窗显示调试信息：

```javascript
import prompt from '@system.prompt';

export default {
  debug(info) {
    if (this.isDebugMode) {
      prompt.showToast({
        message: '调试: ' + JSON.stringify(info)
      });
    }
  }
}
```

### 远程调试

使用快应用调试器进行远程调试：

1. 连接设备到同一网络
2. 在调试器中扫描快应用生成的二维码
3. 连接后可查看日志、检查网络请求和调试 JS

### 性能监控

监控快应用运行性能：

```javascript
const startTime = Date.now();

// 执行操作...

const endTime = Date.now();
console.log(`操作耗时: ${endTime - startTime}ms`);
```

使用快应用性能分析工具：
- 内存使用监控
- 帧率分析
- 启动时间测量

## 常见问题调试

### API 调用问题

调试 API 请求失败的问题：

```javascript
async function debugApiCall(userInput, imageData) {
  try {
    console.group('API 调试');
    console.log('请求参数:', { userInput, imageData });
    
    const startTime = Date.now();
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    
    console.log('请求耗时:', Date.now() - startTime, 'ms');
    console.log('状态码:', response.status);
    
    const headers = {};
    for (let [key, value] of response.headers.entries()) {
      headers[key] = value;
    }
    console.log('响应头:', headers);
    
    const data = await response.json();
    console.log('响应数据:', data);
    
    return data;
  } catch (error) {
    console.error('API 错误:', error);
    throw error;
  } finally {
    console.groupEnd();
  }
}
```

### 图片处理问题

调试图片上传和处理问题：

```javascript
function debugImageUpload(file) {
  console.group('图片上传调试');
  console.log('文件类型:', file.type);
  console.log('文件大小:', file.size, 'bytes');
  
  const reader = new FileReader();
  reader.onload = (e) => {
    console.log('图片加载成功，数据长度:', e.target.result.length);
    
    // 检查 Base64 格式是否正确
    if (typeof e.target.result === 'string') {
      console.log('前缀:', e.target.result.substring(0, 30));
    }
    
    // 创建测试图片元素验证数据有效性
    const testImg = document.createElement('img');
    testImg.onload = () => console.log('图片有效，尺寸:', testImg.width, 'x', testImg.height);
    testImg.onerror = () => console.error('图片数据无效');
    testImg.src = e.target.result;
  };
  
  reader.onerror = (error) => {
    console.error('读取错误:', error);
  };
  
  reader.readAsDataURL(file);
  console.groupEnd();
}
```

### 本地存储问题

调试本地存储问题：

```javascript
// 网页版
function debugLocalStorage(key) {
  console.group('本地存储调试');
  try {
    console.log('存储空间使用情况:', getStorageUsage());
    
    const value = localStorage.getItem(key);
    console.log('键存在:', value !== null);
    
    if (value !== null) {
      try {
        const parsed = JSON.parse(value);
        console.log('值 (解析后):', parsed);
      } catch (e) {
        console.log('值 (原始):', value);
        console.warn('JSON 解析失败');
      }
    }
  } catch (error) {
    console.error('存储访问错误:', error);
  }
  console.groupEnd();
}

// 快应用版
import storage from '@system.storage';

function debugQuickAppStorage(key) {
  storage.get({
    key: key,
    success: function(data) {
      console.log('存储键值获取成功:', key, data);
    },
    fail: function(data, code) {
      console.error(`存储访问失败: ${code}`, data);
    }
  });
}
```

## 跨平台调试最佳实践

### 使用特性检测

在跨平台代码中使用特性检测而非平台检测：

```javascript
function getStorage() {
  // 检测快应用存储 API
  if (typeof require === 'function' && require('@system.storage')) {
    return new QuickAppStorage();
  }
  
  // 检测网页存储 API
  if (typeof localStorage !== 'undefined') {
    return new WebStorage();
  }
  
  // 降级到内存存储
  return new MemoryStorage();
}
```

### 统一的日志记录

创建统一的日志系统，适配不同平台：

```javascript
// logger.js
export class Logger {
  static log(level, ...args) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    // 控制台输出
    console[level](prefix, ...args);
    
    // 在调试模式下添加到日志历史
    if (this.isDebugMode) {
      this.logHistory.push({ level, timestamp, args });
    }
  }
  
  static info(...args) { this.log('info', ...args); }
  static warn(...args) { this.log('warn', ...args); }
  static error(...args) { this.log('error', ...args); }
}
```

### 模拟网络环境

测试不同网络条件下的应用行为：

1. 使用浏览器开发工具的网络节流功能
2. 设置不同的延迟、带宽限制和离线状态
3. 验证应用在弱网络下的性能和错误处理

### 错误监控与上报

实现错误监控系统：

```javascript
window.onerror = function(message, source, lineno, colno, error) {
  console.error('全局错误:', { message, source, lineno, colno });
  
  // 上报错误到服务器
  reportError({
    type: 'js',
    message,
    source,
    lineno,
    colno,
    stack: error?.stack,
    userAgent: navigator.userAgent,
    timestamp: Date.now()
  });
  
  return false; // 允许默认错误处理
};
```

## 调试工具清单

### 网页版

- 浏览器开发者工具
- Lighthouse (性能、可访问性和 SEO 审计)
- Vue Devtools (如果使用 Vue.js)
- Redux DevTools (如果使用 Redux)
- Postman (API 测试)

### 快应用

- 快应用开发者工具
- 快应用预览版
- 快应用调试器
- ADB (Android Debug Bridge)
- 性能监测工具

## 总结

有效的调试策略对于快速发现和解决问题至关重要。本指南提供的技巧和工具可以帮助开发者在网页版和快应用版的开发过程中提高效率，减少调试时间。记住以下关键点：

1. 使用合适的调试工具和方法
2. 添加详细的日志和断点
3. 监控网络请求和性能指标
4. 在不同环境和设备上测试
5. 使用统一的跨平台调试策略
