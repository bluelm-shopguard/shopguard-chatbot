
# 快应用夜间模式适配指南 (1070+)

从 Android 10 开始，系统原生支持了夜间模式（或称深色模式）。快应用从 `1070` 版本开始同步引入此特性，帮助开发者更好地适配，提升用户体验。本教程将指导你从基础的主题配置到高级的样式控制，全面掌握夜间模式的适配方法。

> **兼容性要求**:
> -   **手机系统**: Android 10 或更高版本。
> -   **快应用平台版本**: 1070+ (vivo 手机为 1077+)。
> -   **打包工具**: hap-toolkit 0.6.15+ (`hap -v` 查看版本)。

通过本篇教程，你将学会：

-   配置应用的主题模式 (跟随系统/固定日/夜间)
-   获取当前应用的主题模式
-   监听系统主题模式的切换
-   控制自动反色 (`ForceDark`) 开关
-   通过媒体查询 (Media Query) 为夜间模式自定义样式

---

## 1. 配置应用的主题模式

快应用支持三种主题模式，可在 `manifest.json` 的 `display` 对象中通过 `themeMode` 属性进行配置。

| `themeMode` 值 | 含义 |
| :--- | :--- |
| **-1 (默认)** | **跟随系统**：应用主题会随 Android 系统的日间/夜间模式自动切换。 |
| **0** | **固定日间模式**：应用始终显示为日间模式。 |
| **1** | **固定夜间模式**：应用始终显示为夜间模式。 |

**示例配置 (`manifest.json`):**

```json
"display": {
  "themeMode": -1
}
```

---

## 2. 获取当前主题模式

在代码中，你可以随时获取当前应用正处于何种主题模式，以便执行相应的逻辑。

**步骤**:
调用 `@system.configuration` 的 `getThemeMode()` 方法。

**返回值**:
-   `0`: 当前为日间模式
-   `1`: 当前为夜间模式

**示例代码**:

```javascript
import configuration from '@system.configuration';

export default {
  checkTheme() {
    const currentTheme = configuration.getThemeMode();
    if (currentTheme === 1) {
      console.log('当前是夜间模式');
    } else {
      console.log('当前是日间模式');
    }
  }
}
```

---

## 3. 监听系统主题切换

当用户在系统设置中切换主题时，你的应用可以接收到通知。这通过页面的 `onConfigurationChanged` 生命周期钩子实现。

**步骤**:
在页面的 `<script>` 中实现 `onConfigurationChanged` 方法，并检查其参数 `type` 是否为 `themeMode`。

> **注意**:
> -   即使你的应用设置为固定日间或夜间模式，此回调依然会被触发。
> -   回调中只包含 `type` 信息，如果需要获取切换后的具体模式，需要再次调用 `configuration.getThemeMode()`。

**示例代码 (`index.ux`):**

```javascript
import configuration from '@system.configuration';

export default {
  onConfigurationChanged(params) {
    if (params.type === 'themeMode') {
      const newTheme = configuration.getThemeMode();
      console.log(`主题已切换，新模式为: ${newTheme === 1 ? '夜间' : '日间'}`);
    }
  }
}
```

---

## 4. `ForceDark` 自动反色开关

**什么是 `ForceDark`?**
这是 Android 10 系统提供的一项强大功能。开启后，系统会在夜间模式下自动分析应用的视图并应用一套合适的深色主题，即**自动反色**。快应用默认开启此功能，开发者只需简单配置 `themeMode` 即可获得一个效果不错的夜间模式。

但 `ForceDark` 是系统自动计算的，样式无法手动修改。因此，在需要精细化控制样式的场景下，你需要手动关闭它。

### `ForceDark` 开关层级与规则

`ForceDark` 可以在**应用**、**页面**、**组件**三个层级进行控制。

**基本原则**：子元素的开关状态受父元素影响。**如果父元素关闭了 `ForceDark`，则其所有子元素无论如何设置，都无法开启。**

#### a) 应用级别

控制整个应用的默认反色行为。

-   **位置**: `manifest.json` -> `display` 对象
-   **属性**: `forceDark` (驼峰命名)
-   **值**: `true` (默认开启), `false` (关闭)

```json
"display": {
  "themeMode": -1,
  "forceDark": false
}
```

#### b) 页面级别

覆盖应用级别的设置，控制单个页面的反色行为。

-   **位置**: `manifest.json` -> `display` -> `pages` -> `[PageName]` 对象
-   **属性**: `forceDark` (驼峰命名)
-   **值**: `true` (默认开启), `false` (关闭)

```json
"display": {
  "pages": {
    "DemoPage": {
      "forceDark": false
    }
  }
}
```

#### c) 组件级别

最细粒度的控制，可控制单个组件的反色行为。

-   **位置**: 在组件的标签上直接设置
-   **属性**: `forcedark` (全小写)
-   **值**: `"true"` (默认), `"false"`

```xml
<template>
  <div>
    <!-- 这个 text 组件将不会被自动反色 -->
    <text forcedark="false">关闭了自动反色的文字</text>
    
    <!-- 这个 text 组件会继承父元素的设置 -->
    <text>默认开启自动反色的文字</text>
  </div>
</template>
```

> **组件级开关注意**:
> -   属性名是全小写的 `forcedark`。
> -   `span`, `video`, `camera`, `map`, `canvas` 等部分组件不支持此属性。

---

## 5. 通过媒体查询自定义样式

当你关闭了 `ForceDark` 并希望完全手动设计夜间模式样式时，**媒体查询 (Media Query)** 是最佳选择。快应用支持使用 `prefers-color-scheme` 来检测系统主题。

**支持的查询条件**:
-   `light`: 当系统为日间模式时，内部样式生效。
-   `dark`: 当系统为夜间模式时，内部样式生效。

**示例代码 (`.ux` 文件的 `<style>` 标签内):**

```css
<style>
  .box {
    width: 100px;
    height: 100px;
    /* 默认 (日间模式) 样式 */
    background-color: #EEEEEE;
    color: #333333;
  }

  /* 当系统为夜间模式时，应用以下样式 */
  @media (prefers-color-scheme: dark) {
    .box {
      background-color: #1a1a1a;
      color: #EAEAEA;
    }
  }
</style>
```
