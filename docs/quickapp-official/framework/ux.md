
# 快应用 UX 文件详解

快应用中的所有页面、自定义组件，甚至全局应用配置，都是通过以 `.ux` 为后缀的文件来编写的。一个标准的 `.ux` 文件由三部分组成，各自负责不同的功能：

-   **`<template>`**: 定义页面的结构和布局。
-   **`<style>`**: 定义页面的样式。
-   **`<script>`**: 定义页面的逻辑和数据。

---

## 1. UX 文件结构

一个典型的页面 `.ux` 文件示例如下，清晰地展示了这三个组成部分：

```xml
<!-- 1. template: 定义页面结构 -->
<template>
  <!-- template 内部必须有且仅有一个根节点 -->
  <div class="demo-page">
    <text class="title">欢迎打开{{title}}</text>
    <!-- 绑定点击事件，调用 script 中的方法 -->
    <input class="btn" type="button" value="跳转到详情页" onclick="routeDetail">
  </div>
</template>

<!-- 2. style: 定义页面样式 -->
<style>
  .demo-page {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .title {
    font-size: 40px;
    text-align: center;
  }
  .btn {
    width: 550px;
    height: 86px;
    margin-top: 75px;
    border-radius: 43px;
    background-color: #09ba07;
    font-size: 30px;
    color: #ffffff;
  }
</style>

<!-- 3. script: 定义业务逻辑和数据 -->
<script>
  // 引入系统路由接口
  import router from '@system.router';

  export default {
    // 页面级组件的数据模型
    // private 中定义的属性不允许被外部覆盖
    private: {
      title: '示例页面'
    },
    // 定义方法，可被 template 调用
    routeDetail() {
      // 跳转到应用内的某个页面
      router.push({
        uri: '/DemoDetail'
      });
    }
  }
</script>
```

---

## 2. `app.ux`: 全局应用文件

`app.ux` 是一个特殊的 `.ux` 文件，它代表了整个快应用。它没有 `<template>` 和 `<style>` 部分，只有 `<script>` 部分，主要用于全局配置和逻辑处理。

### 核心功能

1.  **全局脚本和变量**: 你可以在 `app.ux` 中引入公共的 JS 文件或定义全局方法和变量。这些内容会挂载到 App 对象上，应用内的任何页面都可以通过 `this.$app.$def` 来访问。

2.  **全局错误捕获**: 可以通过实现 `onError` 函数来捕获应用在运行期间发生的未处理异常，非常适合用于统一的错误上报和日志记录。

3.  ** manifest 配置注入**: 编译时，系统会将 `manifest.json` 的配置信息注入到 `app.ux` 中。因此，请**不要删除 `app.ux` 文件中默认存在的 `/**manifest**/` 注释**，这块是配置注入的标识。

### 示例代码

```javascript
// app.ux

// 1. 引入公共的工具脚本
import util from './util.js';

/**
 * 应用级别的配置，供所有页面公用
 */
export default {
  // 2. 将公共方法挂载到 App 对象上
  // 页面中可通过 this.$app.$def.showMenu() 调用
  showMenu: util.showMenu,
  createShortcut: util.createShortcut,
  
  // 也可以将整个模块挂载
  // 页面中可通过 this.$app.$def.util.someFunction() 调用
  util,
  
  // 3. 监听全局错误
  onError(err) {
    console.log(`捕获到全局错误: message=${err.message}, stack=${err.stack}`);
    // 在这里可以进行错误上报
  }
}
```
