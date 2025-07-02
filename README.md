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

## 📁 项目结构

```
shopguard-chatbot/
├── docs/                 # 项目文档
├── src/                  # 源代码
│   ├── app.ux            # 快应用入口文件
│   ├── manifest.json     # 快应用配置文件
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

### 网页版到快应用转换

本项目正在从网页版向快应用迁移，详细转换指南请参考：[从网页版迁移到快应用](docs/getting-started/web-to-quickapp.md)

### 组件开发

参考 [组件库文档](docs/development/components.md) 了解组件设计和使用方式。

### 样式指南

我们遵循 [样式指南](docs/development/style-guide.md) 确保界面的一致性。

## 📋 待办清单

- [x] 项目基本结构搭建
- [x] 网页版原型实现
- [x] 聊天功能实现
- [x] 图片上传功能
- [ ] 完善快应用页面
- [ ] 快应用程序实现
- [ ] 在真机上测试

## 🌍 浏览器兼容性

- Chrome (最近2个版本)
- Firefox (最近2个版本)
- Safari (最近2个版本)
- Edge (最近2个版本)

## 📱 快应用兼容性

- 兼容华为、OPPO、VIVO、小米等支持快应用标准的设备
- 最低平台版本：1070

## 👥 贡献指南

欢迎贡献代码、报告问题或提出新功能建议！

1. Fork 本仓库
2. 创建您的特性分支: `git checkout -b feature/amazing-feature`
3. 提交您的更改: `git commit -m 'Add some amazing feature'`
4. 推送到分支: `git push origin feature/amazing-feature`
5. 提交 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详情请参见 [LICENSE](LICENSE) 文件
