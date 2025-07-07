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
    <a href="https://github.com/bluelm-shopguard/shopguard-chatbot/tree/quickapp"><strong>快应用分支</strong></a>
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

4. 启动开发服务器：

```bash
npm run serve
```

5. 构建生产版本：

```bash
npm run build
```
#### 解决 CORS 问题
如果您在前端网页与后端 API 交互时遇到 CORS（跨域资源共享）错误，可以使用项目中提供的代理服务器解决：

确保后端 API 服务器正在运行（默认为 http://localhost:8000）


运行代理服务器
```bash
node server.js
```

使用以下 URL 访问应用：
`http://localhost:8080/src/homepage.html`
代理服务器将自动处理所有到 /v1 端点的请求，并添加必要的 CORS 头信息，使前端能够正常与后端通信。

## 📁 项目结构

```
shopguard-chatbot/
├── docs/                 # 项目文档
├── src/                  # 源代码
│   ├── homepage.html     # 网页版主页面
│   ├── common/           # 共享资源
│   │   ├── images/       # 图片资源
│   │   └── styles/       # 样式文件
│   ├── data/             # 数据管理
│   │   ├── system-settings.js  # 系统设置
│   │   └── user-settings.js    # 用户设置
│   ├── js/               # JavaScript 模块
│   └── pages/            # 子页面
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

这些设置会自动保存到 localStorage。

## 🛠️ 开发指南

完整的开发文档请访问 [在线文档](https://shopguard-chatbot.readthedocs.io/)

### 快应用

见 `quickapp` 分支

## 👥 贡献指南

欢迎贡献代码、报告问题或提出新功能建议！

1. Fork 本仓库
2. 创建您的特性分支: `git checkout -b feature/amazing-feature`
3. 提交您的更改: `git commit -m 'Add some amazing feature'`
4. 推送到分支: `git push origin feature/amazing-feature`
5. 提交 Pull Request
