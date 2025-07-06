
# 快应用项目结构解析

本文档将详细讲解快应用项目的目录结构、核心配置文件、如何新增页面以及如何引入外部依赖。

通过本节，你将学会:

-   理解项目的目录结构
-   配置 `manifest.json` 中的核心信息
-   如何正确地新增和配置页面路由
-   在项目中引入 JS、CSS 和自定义组件

---

## 1. 项目目录结构

使用快应用 IDE 或命令行工具 (`hap-toolkit`) 创建的项目，其核心源代码都位于 `src` 目录下。一个典型的项目根目录结构如下：

```
.
├── src
│   ├── assets          # 公用的静态资源
│   │   ├── images      # 存储 .png/.jpg/.svg 等公共图片
│   │   └── styles      # 存放 .less/.css/.sass 等公共样式
│   ├── helper          # (可选) 项目自定义的辅助工具函数
│   ├── pages           # 存放所有页面级代码的目录
│   │   └── Demo        # 单个页面目录
│   │       └── index.ux# 页面文件
│   ├── app.ux          # 应用入口文件，可包含全局逻辑和样式
│   └── manifest.json   # 项目配置文件，非常重要
└── package.json        # NPM 依赖及项目配置信息
```

-   **`src`**: 项目源文件夹，包含了所有的代码、资源和配置。
-   **`package.json`**: 定义了项目所需的各种模块（如 UI 库、工具库）及相关配置。

---

## 2. 核心配置 (`manifest.json`)

`manifest.json` 是快应用的核心配置文件，用于定义应用的包名、名称、图标、版本、使用的系统接口等。

#### 应用包名 (`package`)
应用的唯一标识，用于区分其他应用。推荐采用反向域名表示法。

```json
{
  "package": "com.company.module"
}
```

#### 应用名称 (`name`)
显示在应用商店、桌面图标下方的名称，建议 6 个汉字以内。

```json
{
  "name": "发票小助手"
}
```

#### 应用图标 (`icon`)
应用图标路径，应为正方形，无白边。

```json
{
  "icon": "/assets/images/logo.png"
}
```

#### 版本号 (`versionName` & `versionCode`)
-   `versionName`: 应用版本名称，格式通常为 `主版本.次版本`。
-   `versionCode`: 应用版本号，为整数，从 1 开始，每次更新上架时**必须自增 1**。

```json
{
  "versionName": "1.0.0",
  "versionCode": 1
}
```

#### 最小平台版本号 (`minPlatformVersion`)
指定应用可运行的最低快应用平台版本。如果你的应用使用了某个新版本平台才有的 API 或特性，**必须**将此值设为对应的版本号，以避免在低版本平台上运行出错。建议填写 `1070` 或更高。

```json
{
  "minPlatformVersion": 1070
}
```

#### 接口声明 (`features`)
使用系统级接口（如网络请求、地理位置等）前，必须在此处声明。

```json
{
  "features": [
    { "name": "system.fetch" },
    { "name": "system.prompt" }
  ]
}
```

---

## 3. 新增页面

新增一个页面主要涉及两步：创建 `.ux` 文件和在 `manifest.json` 中配置路由。

### `router` (路由配置)
`router` 对象定义了应用的入口页面和所有页面的访问路径。

#### 首页 (`router.entry`)
应用启动时默认打开的页面。其值为页面在 `src` 目录下的相对路径。

```json
// 示例：设置 src/pages/Demo/index.ux 为首页
{
  "router": {
    "entry": "pages/Demo"
  }
}
```

#### 页面路由 (`router.pages`)
定义所有页面的信息。`key` 是页面的访问路径 (推荐与目录路径一致)，`value` 是该页面的具体配置。

-   **`component`**: 页面对应的 `.ux` 文件名 (不含后缀)。
-   **`path`**: (可选) 页面的自定义访问路径。

```json
// 假设项目结构如下：
// └── src
//     └── pages
//         ├── Demo
//         │   └── index.ux
//         └── Doc
//             └── Layout
//                 └── index.ux

{
  "router": {
    "entry": "pages/Demo",
    "pages": {
      "pages/Demo": {
        "component": "index"
      },
      "pages/Doc/Layout": {
        "component": "index"
      }
    }
  }
}
```
配置完成后，就可以通过 `router.push({ uri: 'pages/Demo' })` 进行跳转了。

### `display` (UI 显示配置)
`display` 用于定义页面的 UI 外观，如标题栏。可以设置全局默认样式和页面私有样式。

```json
{
  "display": {
    "titleBarText": "默认标题", // 所有页面共享的默认标题
    "pages": {
      "pages/Demo": { // 页面私有配置
        "titleBarText": "Demo页面的专属标题"
      }
    }
  }
}
```

---

## 4. 引入依赖

#### 引入 JS
支持 ES6 `import` 和 CommonJs `require` 两种规范。

```javascript
// 引入系统 API
import fetch from '@system.fetch';
const prompt = require('@system.prompt');

// 引入自定义 JS
import utils from '../../helper/utils.js';
```

#### 引入 CSS
在 `<style>` 标签中使用 `@import` 引入外部 CSS 或 Less 文件。

```css
<style>
  /* 引入外部 .css 文件 */
  @import './style.css';
  /* 引入外部 .less 文件 */
  @import './style.less';
</style>
```

#### 引入自定义组件
使用 `<import>` 标签引入自定义组件文件。
-   `src`: 组件文件的相对路径 (不含 `.ux` 后缀)。
-   `name`: 在模板中使用的组件标签名。

```xml
<!-- src/pages/Demo/index.ux -->

<!-- 1. 引入组件 -->
<import name="my-component" src="./components/MyComponent"></import>

<template>
  <div>
    <!-- 2. 使用组件 -->
    <my-component></my-component>
  </div>
</template>
```
