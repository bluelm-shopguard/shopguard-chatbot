
# 快应用页面样式与布局指南

本节将介绍快应用开发中的核心样式与布局知识，包括盒模型、长度单位、Flex 布局，以及如何动态修改样式和使用 CSS 预处理器。

通过本节，你将学会：

-   理解快应用的盒模型
-   掌握 `px`、`dp`、`%` 等长度单位
-   使用 `position`进行定位
-   掌握多种样式设置方式
-   应用 Flex 布局构建页面
-   通过数据绑定动态修改样式
-   引入 Less/SCSS/PostCSS 等预编译方案

---

## 1. 盒模型

快应用布局框架统一使用 `border-box` 盒模型，这意味着元素的 `width` 和 `height` 属性已经包含了 `padding` 和 `border`。此行为不可更改。

-   **布局所占宽度**: `Width` = `width` (已包含 `padding-left/right` + `border-left/right`)
-   **布局所占高度**: `Height` = `height` (已包含 `padding-top/bottom` + `border-top/bottom`)

---

## 2. 长度单位

#### `px`
此 `px` **并非**物理像素，而是类似于 `rem` 的一个相对长度单位。框架会根据项目配置的基准宽度，自动将其适配到不同尺寸的移动端屏幕上。

开发者只需按照设计稿的 `px` 值进行开发即可，框架会负责转换。

-   **基准宽度**: 在 `manifest.json` 中通过 `config.designWidth` 配置，默认为 `750`。
-   **转换公式**: `设计稿1px / 设计稿基准宽度 = 框架样式1px / 项目配置基准宽度`

**示例：**
设计稿宽度为 640px，一个元素在稿上宽度为 100px。

-   **方案一 (推荐)**: 修改 `manifest.json` 的 `designWidth` 为 `640`，那么在 `.ux` 文件中可以直接写 `width: 100px;`。
-   **方案二**: 保持 `designWidth` 为默认的 `750`。根据公式 `100 / 640 = x / 750`，计算出 `x ≈ 117`。在 `.ux` 文件中应写 `width: 117px;`。

#### `dp` (1080+)
`dp` (device independent pixels) 是设备独立像素。其计算依赖于屏幕密度 (`screenDensity`)。

-   **计算公式**: `dp 数值 = 物理像素 / screenDensity`
-   **示例**: 一台 1920x1080 分辨率的手机，若 `screenDensity` 为 3，则其屏幕宽度为 `1080 / 3 = 360dp`。

```css
.dp-box {
  width: 360dp; /* 占满整个屏幕宽度 */
  height: 360dp;
}
```

#### `%`
百分比单位的计算规则与标准 CSS 类似，相对于父元素进行计算。

---

## 3. 设置定位 (`position`) (1060+)

从 1060 版本开始，`position` 支持 `relative` (默认值)、`absolute` 和 `fixed`。其行为与标准 CSS 基本一致。

---

## 4. 设置样式

快应用支持多种方式为组件设置样式，优先级与 CSS 规则一致。

-   **内联样式**: `<text style="color: #FF0000;">内联样式</text>`
-   **选择器**:
    -   ID 选择器: `#title { ... }`
    -   Class 选择器 (推荐): `.title { ... }`
    -   Tag 选择器: `text { ... }`
    -   并列选择器: `.title, #title { ... }`
    -   后代选择器: `.tutorial-page text { ... }`
    -   直接后代选择器: `.tutorial-page > text { ... }`

**注意**: 自定义组件的样式是**隔离的**，它不会继承或响应父组件的样式。

---

## 5. Flex 布局

快应用的核心布局机制是 **Flex 布局**。所有 `div` 组件默认就是一个 Flex 容器 (`display: flex`)。

-   `flex-direction`: 主轴方向 (`row` | `column`)。
-   `justify-content`: 主轴对齐方式 (`flex-start` | `center` | `flex-end` | ...)。
-   `align-items`: 交叉轴对齐方式 (`flex-start` | `center` | `flex-end` | `stretch` | ...)。

**示例：**

```xml
<template>
  <div class="container">
    <text class="item">Item 1</text>
    <text class="item">Item 2</text>
  </div>
</template>

<style>
  .container {
    /* 主轴方向为垂直 */
    flex-direction: column;
    /* 交叉轴（水平方向）居中 */
    align-items: center;
  }
  .item {
    width: 200px;
    height: 100px;
    margin: 10px;
    background-color: #FF0000;
  }
</style>
```

---

## 6. 动态修改样式

可以通过数据绑定的方式动态修改组件的样式。

-   **修改 class**: `<text class="normal-text {{ className }}">`
-   **修改内联 style**: `<text style="color: {{ textColor }};">`
-   **绑定样式对象 (1030+)**: `<text style="{{ styleObj }}">`
-   **绑定样式字符串 (1030+)**: `<text style="{{ styleText }}">`

**示例：**

```javascript
// <script>
export default {
  private: {
    className: 'text-blue',
    textColor: '#0faeff',
    styleObj: { color: 'red' }
  },
  changeClassName () {
    // 点击后 class 从 text-blue 变为 text-red
    this.className = this.className === 'text-blue' ? 'text-red' : 'text-blue';
  }
}
```

---

## 7. CSS 预处理器

快应用支持 Less, SCSS, PostCSS 等预处理器，以增强 CSS 的编写能力。

#### 使用 Less/SCSS

1.  **安装依赖**:
    -   Less: `npm i less less-loader -D`
    -   SCSS: `npm i node-sass sass-loader -D`
2.  **在 `<style>` 标签上声明**:
    -   `<style lang="less"> ... </style>`
    -   `<style lang="scss"> ... </style>`
3.  **使用**: 你可以在 `<style>` 块中使用变量、嵌套、混合等预处理器特性，也可以通过 `@import` 引入外部的 `.less` 或 `.scss` 文件。

#### 使用 PostCSS

1.  **安装依赖**: `npm i postcss-loader precss@3.1.2 -D`
2.  **创建配置文件**: 在项目根目录新建 `postcss.config.js`。
    ```javascript
    // postcss.config.js
    module.exports = {
      plugins: [
        require('precss') // 使用 precss 插件来支持类似 Sass 的语法
      ]
    }
    ```
3.  **在 `<style>` 标签上声明**: `<style lang="postcss"> ... </style>`

---

## 总结

掌握了页面样式与布局的基础后，你就可以开始构建丰富多样的快应用界面了。核心是熟练运用 Flex 布局和 `px` 单位，并结合数据绑定来实现动态效果。
