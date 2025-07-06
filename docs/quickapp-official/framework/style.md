
# 快应用 Style 样式指南

`<style>` 部分用于描述 `<template>` 中组件的样式，决定了组件在屏幕上的显示效果。快应用的样式系统核心基于 **CSS Flexbox**（弹性盒）布局，并针对原生组件的特性进行了一定的扩充和修改。

### 尺寸自动缩放

为了解决多设备屏幕适配的问题，框架内置了一套尺寸缩放机制。所有与尺寸相关的单位（如 `width`, `height`, `font-size`, `margin` 等）都会以一个**基准宽度**（默认为 **750px**）为基础，根据设备的实际屏幕宽度进行等比缩放。

**示例**：在一个 `width: 100px` 的样式，如果应用运行在宽度为 1500px 的屏幕上，该元素的实际渲染宽度将是 `(1500 / 750) * 100 = 200px`。

---

## 文件导入

样式支持两种方式从外部 `.css` 文件导入：

1.  **完全替换**: 使用 `<style>` 标签的 `src` 属性。这会用外部文件的内容完全替换当前页面的样式。

    ```xml
    <!-- 导入外部文件，代替 style 内部样式 -->
    <style src="./style.css"></style>
    ```

2.  **合并导入**: 在 `<style>` 标签内部使用 `@import` 规则。这会将外部文件的样式合并到当前样式中。

    ```xml
    <!-- 合并外部文件 -->
    <style>
      @import './another-style.css';

      .local-class {
        /* ... 本地定义的其他样式 ... */
      }
    </style>
    ```

---

## 模板内部样式

与 Web 开发类似，可以通过 `style` 和 `class` 属性来为组件指定样式。

```xml
<!-- 1. 内联样式 (inline style) -->
<div style="color: red; font-size: 30px;"></div>

<!-- 2. class 样式 -->
<div class="class-a class-b"></div>
```

---

## 选择器

支持的 CSS 选择器是 Web 标准的一个子集。

| 选择器 | 样例 | 描述 |
| :--- | :--- | :--- |
| **`.class`** | `.intro` | 选择所有 `class="intro"` 的组件 |
| **`#id`** | `#firstname`| 选择所有 `id="firstname"` 的组件 |
| **`tag`** | `div` | 选择所有 `<div>` 组件 |
| **`,`** | `.a, .b` | 选择所有 class 为 `.a` 或 `.b` 的组件 |
| **后代** | `.page text` | 选择 `.page` 内部所有的 `<text>` 组件 |
| **直接后代**| `.page > text`| 选择 `.page` 的直接子元素中的 `<text>` 组件 |

### 选择器与动态更新的性能限制

为了优化渲染性能，当通过数据绑定动态改变 `class` 时，框架**仅支持对组合选择器中最后一个 class 的变更进行 DOM 更新**。

**示例**:
对于样式规则 `.doc-body .row-desc`：
-   动态改变 `<text>` 的 class（如从 `row-desc1` 变为 `row-desc2`），样式会**生效**。
-   动态改变 `<div>` 的 class（如从 `doc-body` 变为 `doc-body2`），由于 `doc-body` 不是最后一个选择器，其关联的样式变更**不会生效**。

---

## 选择器优先级

优先级计算规则与浏览器保持一致，权值高的优先。
**优先级顺序**: 内联样式 > `#id` > `.class` > `tag`

当一个元素被多个选择器匹配时，会计算各个选择器的权值之和，总权值越高，优先级越高。如果权值相同，则后声明的样式会覆盖先声明的。

-   ID 选择器 (`#id`): 权值 10000
-   类选择器 (`.class`): 权值 100
-   标签选择器 (`tag`): 权值 1

---

## 媒体查询 (1070+)

从 `1070` 版本开始，快应用支持媒体查询（Media Query），允许开发者根据设备的特征（如屏幕方向、宽高、分辨率等）来应用不同的样式。

**兼容性要求**:
-   快应用平台版本 ≥ 1070
-   hap-toolkit 版本 ≥ 0.6.15

### 语法

支持 `@media` 和 `@import` 两种方式引入。

```css
/* @media 方式 */
@media (orientation: landscape) {
  .box {
    background-color: white; /* 横屏时生效 */
  }
}

/* @import 方式 */
@import './landscape.css' (orientation: landscape);
```

### 支持的媒体类型

| 类型 | 描述 |
|:--- |:--- |
| `screen` | 主要用于屏幕设备。 |

### 支持的媒体特性

| 特性 | 描述 | 是否带单位 |
|:---|:---|:---|
| `width`, `min-width`, `max-width` | 可视区域的宽度 | 否 (单位默认为 dp) |
| `height`, `min-height`, `max-height`| 可视区域的高度 | 否 (单位默认为 dp) |
| `orientation` | 屏幕方向 (`portrait` 竖屏, `landscape` 横屏) | 否 |
| `resolution`, `min/max-resolution`| 设备分辨率 | 是 (`dppx` 或 `dpi`) |
| `aspect-ratio`, `min/max-aspect-ratio`| 可视区域宽高比 (格式: `x / y`) | 否 |
| `prefers-color-scheme` | 系统主题 (`light` 日间, `dark` 夜间) (Android 10+) | 否 |

**单位说明**:
-   `dppx`: 等同于 `device.getInfo()` 返回的 `screenDensity`。
-   `dpi`: 等于 `dppx * 160`。
-   `dp`: `width` 等特性使用的默认单位，值为 `物理像素 / screenDensity`。

### 逻辑操作符

可以使用 `and`, `not`, `only`, `,` (逗号，等同于 or), `<=`, `>=`, `<`, `>` 等逻辑操作符组合复杂的查询条件。

---

## 样式预编译

快应用原生支持 **Less** 和 **Sass** 预编译器。只需在 `<style>` 标签上添加 `lang` 属性即可。

```xml
<!-- 使用 Less -->
<style lang="less">
  @import './variables.less';
  .page {
    .title {
      font-size: @title-font-size;
    }
  }
</style>
```

---

## 伪类

伪类用于在特定状态下为组件应用样式。

| 伪类 | 触发条件 | 适用组件 |
|:---|:---|:---|
| `:disabled` | 组件的 `disabled` 属性为 `true` 时生效。 | 所有支持 `disabled` 属性的组件 (如 `input`)。 |
| `:checked` | 组件的 `checked` 属性为 `true` 时生效。 | `input` (type=checkbox/radio), `switch` 等。 |
| `:focus` | 组件获得焦点时生效（用户操作或调用 `focus()` 方法）。 | `input` 等。 |
| `:active` (1010+) | 用户按下组件时生效。 | 默认可点击组件直接生效；对于 `div`, `text` 等组件，需同时绑定 `click` 事件。 |

**示例**:
```xml
<template>
  <input type="button" class="btn" disabled="{{isBtnDisabled}}" value="Click">
</template>

<style>
  .btn {
    background-color: red;
  }
  .btn:disabled {
    background-color: green; /* 当 disabled 为 true 时，背景变绿 */
  }
</style>
```
