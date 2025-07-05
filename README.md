# ShopGuard AI - 购物防诈骗助手

<div align="center">
  <img src="docs/assets/full-design.png" alt="ShopGuard AI Logo" width="200">
  <p>
    <strong>智能购物防诈骗助手，基于大语言模型，帮助您识别商品风险</strong>
  </p>
  <p>
    <a href="https://github.com/bluelm-shopguard/bluelm-shopguard"><strong>主项目仓库</strong></a>
    ·
    <a href="https://shopguard-chatbot.readthedocs.io/"><strong>在线文档</strong></a>
    ·
    <a href="docs/getting-started/quick-start.md"><strong>快速开始</strong></a>
  </p>
</div>

## 📱 项目概述

ShopGuard AI 是一款专为识别购物诈骗风险设计的智能助手应用。用户可以发送商品截图、链接或聊天记录，AI 将分析内容并提供风险评估。项目支持网页版和快应用两种形式，本仓库主要包含快应用前端的实现。

### 主要功能

- 🔍 **图片识别**：分析商品图片中的风险信息
- 🔗 **链接分析**：检测可疑购物链接
- 💬 **聊天记录分析**：识别卖家聊天中的诈骗迹象
- ⭐ **风险评级**：提供直观的"诈骗风险星级"评分
- 🛡️ **购物建议**：针对不同风险提供专业防骗建议

## 🚀 快速开始

### 环境要求

- Web 环境：现代浏览器（Chrome、Firefox、Safari 等）
- 快应用环境：支持快应用的安卓设备或模拟器

### 安装运行

#### 网页版

1. 克隆仓库：

```bash
git clone https://github.com/bluelm-shopguard/shopguard-chatbot.git
cd shopguard-chatbot
```

2. 安装依赖：

```bash
npm install
```

3. 配置 API 连接：

打开 `src/data/system-settings.js` 更新 API 配置：

```javascript
export let SystemSettings = {
  api: {
    endpoint: "https://your-api-endpoint.com/v1/chat/completions",
    model: "your-model-name",
    // ... 其他设置
  },
};
```

4. 运行网页应用：

```bash
# 启动服务器
npm run serve

# 或者自动打开浏览器访问应用
npm run open
```

服务启动后，访问 http://localhost:8080/ 即可打开应用。

### 解决 CORS 问题

如果您在前端网页与后端 API 交互时遇到 CORS（跨域资源共享）错误，可以使用项目中提供的代理服务器解决：

1. 确保后端 API 服务器正在运行（默认为 `http://localhost:8000`）

2. 启动代理服务器：

   ```bash
   # 运行代理服务器
   node server.js
   ```

3. 使用以下 URL 访问应用：

   ```text
   http://localhost:8080/src/homepage.html
   ```

代理服务器将自动处理所有到 `/v1` 端点的请求，并添加必要的 CORS 头信息，使前端能够正常与后端通信。

更多详细信息请查看 [CORS 代理服务器使用指南](docs/cors-proxy-guide.md)。

#### 快应用版本

快应用版本需要使用快应用开发工具编译运行：

1. 安装快应用开发者工具
2. 执行构建命令
3. 在模拟器或真机上测试

## 📁 项目结构

```
shopguard-chatbot/
├── docs/                 # 项目文档
├── index.html            # 网页版入口（重定向到 homepage.html）
├── src/                  # 源代码
│   ├── app.ux            # 快应用入口文件（快应用分支）
│   ├── manifest.json     # 应用配置文件
│   ├── homepage.html     # 网页版主页面
│   ├── common/           # 共享资源
│   │   ├── images/       # 图片资源
│   │   └── styles/       # 样式文件
│   ├── data/             # 数据管理
│   │   ├── system-settings.js  # 系统设置
│   │   ├── language-manager.js # 多语言支持
│   │   └── user-settings.js    # 用户设置
│   ├── js/               # JavaScript 模块
│   │   └── theme-manager.js    # 主题管理
│   └── pages/            # 子页面
│       ├── about.html    # 关于页面
│       ├── setting.html  # 设置页面
│       └── draft.html    # 草稿页面
└── mkdocs.yml            # 文档配置
```

## ⚙️ 配置说明

### 系统设置

编辑 `src/data/system-settings.js` 可配置：
- API 端点和模型
- 功能开关
- 错误信息和欢迎语

```javascript
export let SystemSettings = {
  api: {
    endpoint: "http://localhost:8000/v1/chat/completions",
    model: "vivo-BlueLM-TB-Pro",
    timeout: 30000, // 30秒
    maxRetries: 3,
  },
  // ... 更多配置
};
```

### 用户设置

`src/data/user-settings.js` 存储用户首选项：

- 主题设置
- 语言选择
- 历史记录保存选项

这些设置会自动保存到浏览器的 localStorage 中。

### 运行与部署

本项目为纯前端应用，可以通过以下方式运行和部署：

1. **本地开发服务器**：
   ```bash
   npm run serve   # 启动本地服务器
   npm run open    # 启动并自动打开浏览器
   ```

2. **部署到静态网站托管**：
   - 将整个项目目录部署到静态网站服务器
   - 或部署到 GitHub Pages, Netlify, Vercel 等静态网站托管服务

## 🛠️ 开发指南

完整的开发文档请访问 [在线文档](https://shopguard-chatbot.readthedocs.io/)

### 分支说明

本仓库包含两个主要分支：
- `main`/`master`: 网页版应用（当前分支）
- `quickapp`: 快应用版本开发分支

### 组件开发

参考 [组件库文档](docs/development/components.md) 了解组件设计和使用方式。

### 样式指南

我们遵循 [样式指南](docs/development/style-guide.md) 确保界面的一致性。

## 📋 待办清单

- [x] 项目基本结构搭建
- [x] 网页版原型实现
- [x] 聊天功能实现
- [x] 图片上传功能
- [x] 本地开发环境配置
- [ ] 完善网页版功能
- [ ] 多语言支持改进
- [ ] 性能优化

## 🌍 浏览器兼容性

- Chrome (最近2个版本)
- Firefox (最近2个版本)
- Safari (最近2个版本)
- Edge (最近2个版本)

## 📱 设备兼容性

- 桌面端：Windows、macOS、Linux
- 移动端：通过响应式设计支持各尺寸屏幕

## 👥 贡献指南

欢迎贡献代码、报告问题或提出新功能建议！

1. Fork 本仓库
2. 创建您的特性分支: `git checkout -b feature/amazing-feature`
3. 提交您的更改: `git commit -m 'Add some amazing feature'`
4. 推送到分支: `git push origin feature/amazing-feature`
5. 提交 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详情请参见 [LICENSE](LICENSE) 文件
