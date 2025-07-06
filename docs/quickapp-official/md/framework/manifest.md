
# manifest.json 文件详解

`manifest.json` 是快应用项目的核心配置文件，它包含了应用的基本信息、接口权限声明、页面路由、UI显示风格等全局配置。

## 1. 顶层结构

| 属性 | 类型 | 必填 | 描述 |
|:---|:---|:---|:---|
| `package` | String | 是 | 应用包名，必须全局唯一，推荐格式 `com.company.module`。 |
| `name` | String | 是 | 应用名称，显示在桌面图标、弹窗等位置。 |
| `icon` | String | 是 | 应用图标的路径，如 `/Common/logo.png`。 |
| `versionName`| String | 否 | 应用版本名称，如 "1.0.0"。 |
| `versionCode`| Integer | 是 | 应用版本号，为正整数，每次提交新包时应自增。 |
| `minPlatformVersion` | Integer | 否 | 支持的最小平台版本号，用于兼容性检查。 |
| `features` | Array | 否 | 声明应用需要使用的系统接口，如 `[{ "name": "system.network" }]`。 |
| `config` | Object | 是 | 应用的全局配置，详见下文。 |
| `router` | Object | 是 | 应用的页面路由配置，详见下文。 |
| `display` | Object | 否 | 应用的全局 UI 显示配置，详见下文。 |
| `subpackages` (1040+) | Array | 否 | 定义分包加载配置。 |
| `trustedSslDomains` (1060+) | Array | 否 | 可信的 HTTPS 站点列表。 |

---

## 2. `config` 对象

定义系统级别的配置和全局数据。

| 属性 | 类型 | 默认值 | 描述 |
|:---|:---|:---|:---|
| `logLevel` | String | "log" | 日志打印级别，可选 `off`, `error`, `warn`, `info`, `log`, `debug`。 |
| `designWidth`| Integer | 750 | 页面设计稿的基准宽度 (单位px)，框架会据此进行缩放适配。 |
| `data` | Object | - | 定义全局数据，可在页面中通过 `this.$app.$data` 访问。 |
| `background` (1050+) | Object | - | 后台运行相关配置。 |
| `network` (1060+) | Object | - | 网络请求的全局超时配置 (ms)，包含`connectTimeout`, `readTimeout`, `writeTimeout`。 |
| `grayMode` (1100+) | Object | - | 灰色模式，可配置 `enable`, `duration`, `excludedPages`。 |

---

## 3. `router` 对象

定义应用的页面路由，即哪些页面是应用的一部分以及如何访问它们。

| 属性 | 类型 | 必填 | 描述 |
|:---|:---|:---|:---|
| `entry` | String | 是 | 指定应用的入口页面（首页）的名称。 |
| `pages` | Object | 是 | 所有页面的配置列表。Key 是页面名称，Value 是页面配置对象。 |
| `errorPage` (1060+) | String | 否 | 自定义错误页面的名称，当页面跳转失败时会显示此页面。 |

### `router.pages` 页面配置

| 属性 | 类型 | 默认值 | 描述 |
|:---|:---|:---|:---|
| `component` | String | - | **必填**。页面对应的 `.ux` 组件文件名（不含后缀）。 |
| `path` | String | `/<页面名称>` | 页面的访问路径，必须唯一，如 `/user/profile`。 |
| `filter` | Object | - | 声明页面可以处理的外部请求，如 deeplink。 |
| `launchMode` (1050+) | String | `standard` | 页面的启动模式。`standard` (每次都创建新实例) 或 `singleTask` (复用已有实例)。 |

---

## 4. `display` 对象

定义全局或特定页面的 UI 显示样式。

| 属性 | 类型 | 默认值 | 描述 |
|:---|:---|:---|:---|
| `backgroundColor` | String | `#ffffff` | 窗口背景色。 |
| `fullScreen` | Boolean| `false` | 是否全屏显示。 |
| `titleBar` | Boolean| `true` | 是否显示默认标题栏。 |
| `titleBarBackgroundColor` | String | `#000000` | 标题栏背景色。 |
| `titleBarTextColor` | String | - | 标题栏文字颜色。 |
| `titleBarText` | String | - | 标题栏默认文字。 |
| `windowSoftInputMode` (1030+) | String | `adjustPan` | 软键盘弹出时页面的调整方式，可选 `adjustPan` (上移) 或 `adjustResize` (压缩)。 |
| `orientation` (1040+) | String | `portrait` | 屏幕方向，可选 `portrait` (竖屏) 或 `landscape` (横屏)。 |
| `statusBarImmersive` (1050+) | Boolean| `false` | 是否开启沉浸式状态栏 (需先隐藏 `titleBar`)。 |
| `fitCutout` (1060+) | String | - | 在异形屏（如刘海屏、水滴屏）区域的绘制策略。 |
| `themeMode` (1070+) | Number | -1 | 主题模式。-1 (跟随系统), 0 (日间模式), 1 (夜间模式)。 |
| `forceDark` (1070+) | Boolean| `true` | (Android 10+) 是否允许系统对应用界面进行强制暗色反转。 |
| `pageCache` (1080+) | Boolean| `false` | 是否缓存页面以提高二次打开速度，在 `display.pages` 中针对特定页面配置。 |
| `pageAnimation` (1100+) | Object | - | 配置页面切换动画，可配置 `openEnter`, `closeEnter`, `openExit`, `closeExit`。 |
| `tabBar` (1200+) | Object | - | 定义底部 Tab 栏的样式和页面列表。 |
| `pages` | Object | - | **重要**：可在此处针对特定页面覆盖上述全局 `display` 配置。 |

---

## 5. `subpackages` (分包加载) (1040+)

通过定义分包，可以将应用的部分功能和资源拆分出去，在需要时再进行网络加载，从而减小主包体积，提升首次启动速度。

**示例**:
```json
"subpackages": [
  {
    "name": "pkgA",
    "resource": "PackageA"
  }
]
```
-   **`name`**: 分包的名称。
-   **`resource`**: 分包对应的资源目录路径。

---

## 示例 `manifest.json`

```json
{
  "package": "com.example.demo",
  "name": "示例应用",
  "icon": "/Common/logo.png",
  "versionName": "1.0.0",
  "versionCode": 1,
  "minPlatformVersion": 1070,
  "features": [
    { "name": "system.network" },
    { "name": "system.storage" }
  ],
  "config": {
    "logLevel": "debug",
    "designWidth": 750
  },
  "router": {
    "entry": "Home",
    "pages": {
      "Home": {
        "component": "index",
        "path": "/"
      },
      "About": {
        "component": "about"
      }
    }
  },
  "display": {
    "titleBar": true,
    "titleBarBackgroundColor": "#f2f2f2",
    "titleBarTextColor": "#333333",
    "backgroundColor": "#eeeeee",
    "pages": {
      "Home": {
        "titleBarText": "首页"
      },
      "About": {
        "titleBarText": "关于我们",
        "fullScreen": true
      }
    }
  }
}
```
