# 常见问题解答 (FAQ)

本页面收集了 ShopGuard AI 聊天机器人开发和使用过程中的常见问题及其解答。如果您的问题未在此列出，请在 [GitHub Issues](https://github.com/bluelm-shopguard/shopguard-chatbot/issues) 中提出。

## 一般问题

### ShopGuard AI 是什么？

ShopGuard AI 是一款购物防诈骗助手，利用大语言模型帮助用户识别商品、商家或交易过程中的潜在风险。用户可以发送商品截图、链接或聊天记录，AI 将分析内容并提供风险评级和专业建议。

### 这款应用如何保护我的隐私？

ShopGuard AI 在设计上注重隐私保护：

1. 所有分析都在服务器端完成，无需在本地存储敏感数据
2. 默认情况下不会永久保存用户上传的图片
3. 聊天记录仅存储在用户自己的设备上
4. 用户可以随时清除聊天历史

### 支持哪些平台？

ShopGuard AI 目前支持：

- 网页版：兼容现代浏览器（Chrome、Firefox、Safari、Edge 等）
- 快应用版：兼容支持快应用标准的安卓设备（华为、OPPO、VIVO、小米等）

## 使用问题

### 如何使用图片分析功能？

1. 点击聊天输入框旁边的图片按钮
2. 选择您要分析的商品图片
3. 可以添加文字描述提供更多上下文（可选）
4. 点击发送按钮
5. AI 将分析图片内容并提供风险评估

### 图片上传有什么限制？

图片上传限制如下：
- 最大文件大小：10MB
- 支持格式：JPEG、PNG、WebP 等常见图片格式
- 每次对话最多可发送一张图片

### 无法连接到服务器怎么办？

如果遇到连接问题，请尝试：

1. 检查网络连接
2. 确认是否配置了正确的 API 端点
3. 检查 API 服务是否在运行
4. 重启应用程序
5. 如果问题持续存在，请尝试在设置中切换到备用 API 端点

### 如何清除我的聊天记录？

1. 点击侧边栏中的设置图标
2. 在设置页面中找到"聊天历史"选项
3. 选择"清除所有历史记录"
4. 确认操作后，所有本地存储的聊天记录将被删除

## 开发问题

### 如何配置 API 连接？

更新 `src/data/system-settings.js` 中的配置：

```javascript
export let SystemSettings = {
  api: {
    endpoint: "https://your-api-endpoint.com/v1/chat/completions",
    model: "your-model-name",
    timeout: 30000, // 30秒
    maxRetries: 3,
  },
  // ... 其他设置
};
```

### 如何本地部署调试服务器？

1. 确保您已安装 Node.js（推荐版本 14 或更高）
2. 在项目根目录下运行：`npm install` 安装依赖
3. 运行 `npm run serve` 启动开发服务器
4. 访问 `http://localhost:8080` 打开应用

### 如何将应用打包为快应用？

1. 安装快应用开发工具：`npm install -g hap-toolkit`
2. 在项目根目录下运行：`npm run build:quickapp`
3. 生成的快应用包将位于 `dist/` 目录中
4. 使用快应用预览工具安装和测试

### 如何添加新的主题？

1. 在 `src/common/styles/homepage.css` 中为新主题添加 CSS 变量：

```css
[data-theme="your-theme-name"] {
  --primary-color: #your-color;
  --primary-hover: #your-hover-color;
  /* 添加所有必要的颜色变量 */
}
```

2. 在 `src/data/user-settings.js` 的主题选项中添加新主题：

```javascript
theme: {
  default: "light",
  options: [
    { id: "light", name: "浅色模式" },
    { id: "dark", name: "深色模式" },
    { id: "your-theme-name", name: "您的主题名称" },
    { id: "system", name: "跟随系统" },
  ],
},
```

### 如何定制错误消息？

在 `src/data/system-settings.js` 中更新 `chat.errorMessage`：

```javascript
chat: {
  welcomeMessage: "...",
  errorMessage: "您的自定义错误消息",
}
```

您也可以在 `callChatbotAPI` 函数中针对不同错误类型定制不同的错误消息。

## 快应用转换问题

### 快应用与网页版有哪些主要区别？

主要区别包括：

1. 文件结构：网页版使用 HTML/CSS/JS，快应用使用 .ux 文件（类似 Vue 单文件组件）
2. API 访问：快应用使用特定的系统 API 而非浏览器 API
3. 存储机制：使用 `@system.storage` 替代 localStorage
4. 样式系统：快应用仅支持 Flex 布局
5. 组件系统：某些 HTML 元素在快应用中有不同的对应元素

详细信息请参考[从网页版迁移到快应用](../getting-started/web-to-quickapp.md)文档。

### 快应用中如何处理图片上传？

快应用使用媒体 API 处理图片选择：

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

### 如何在快应用中实现页面路由？

快应用使用内置的路由系统：

```javascript
import router from '@system.router';

export default {
  goToPage() {
    router.push({
      uri: '/pages/PageName',
      params: { key: 'value' }
    });
  }
}
```

## 故障排除

### API 调用失败

常见原因和解决方法：

1. **网络问题**：检查网络连接
2. **API 端点错误**：验证 `system-settings.js` 中的 API 端点配置
3. **CORS 问题**：确保 API 服务器允许来自应用域名的跨域请求
4. **身份验证失败**：检查是否提供了必要的 API 密钥或令牌
5. **请求格式错误**：验证发送到 API 的消息格式是否符合要求

### 图片上传问题

如果图片上传失败：

1. 确认图片未超过大小限制（10MB）
2. 检查图片格式是否受支持
3. 尝试使用较小或已压缩的图片
4. 检查浏览器控制台是否有相关错误信息

### 主题切换不生效

可能的原因：

1. 本地存储被禁用或已满
2. CSS 变量未正确定义
3. 主题管理器未正确初始化

解决方法：

1. 清除浏览器缓存和 Cookie
2. 确认 `theme-manager.js` 中的事件监听器正常工作
3. 检查 CSS 文件中的主题变量定义

### 快应用预览问题

如果快应用预览出现问题：

1. 确认使用了最新版本的快应用预览工具
2. 检查 `manifest.json` 配置是否正确
3. 验证 IDE 编译输出中是否有错误或警告
4. 尝试在不同设备或模拟器上测试
