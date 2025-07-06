
# URL 跳转配置 (已废弃)

> **注意：** 快应用联盟已不再推荐使用此方式从 H5 跳转到快应用，并计划在未来关闭此跳转方式。如需在 H5 页面中接入跳转快应用的能力，请优先参考和使用官方推荐的 **[H5 点击组件](https://doc.quickapp.cn/tutorial/platform-capability/h5-component.html)**。

URL 跳转配置允许开发者在 H5 页面中通过调用特定接口来唤起快应用。

---

## 接入方式

要使用此功能，需要在你的网页 `<head>` 中嵌入以下 JS 脚本，该脚本同时支持 HTTP 与 HTTPS 协议。

```html
<script type="text/javascript" src="//statres.quickapp.cn/quickapp/js/routerinline.min.js"></script>
```

**重要提示**：所有功能函数（`appRouter`, `channelReady`）都必须在 `<body>` 标签内调用，不支持在 `<head>` 中调用。

---

## 1. 调起应用 `appRouter()`

调用 `appRouter(packageName, path, params, confirm)` 函数来尝试调起指定的快应用。

#### 参数说明

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| `packageName` | `String` | 是 | 快应用的包名，必须与 `manifest.json` 中的 `package` 属性完全一致。 |
| `path` | `String` | 否 | 要跳转的页面路径，对应 `manifest.json` 中 `router.pages` 里页面的 `path` 字段。如果**不传或为空字符串**，则打开应用首页。 |
| `params` | `Object` | 否 | 需要透传给快应用页面的参数。目标页面可以通过 `public` 声明的同名变量接收这些参数。如果**不传此参数**，则默认使用当前 H5 页面的 URL query 参数。 |
| `confirm` | `String` | 否 | 在跳转确认弹窗中显示的文案。如果此值为空或 `null`，将直接尝试跳转；否则，会先弹窗让用户确认，弹窗中显示此文案。 |

#### 示例代码

```html
<!DOCTYPE html>
<html>
<head>
    <title>URL 跳转配置示例</title>
    <script type="text/javascript" src="//statres.quickapp.cn/quickapp/js/routerinline.min.js"></script>
</head>
<body>
    <script type="text/javascript">
        // 注意：以下两个示例请只选择一个运行

        // 示例1：无需用户确认，直接跳转
        // 包名: xxx.yyy.zzz
        // 路径: Home/Video
        // 参数: { a: 2, b: 'efg' }
        appRouter('xxx.yyy.zzz', 'Home/Video', { a: 2, b: 'efg' });

        // 示例2：需要用户确认，并显示提示文案
        // 包名: xxx.yyy.zzz
        // 路径: Home/Audio
        // 参数: { a: 1, b: 'abc' }
        // 确认文案: 'Quick App Demo'
        appRouter('xxx.yyy.zzz', 'Home/Audio', { a: 1, b: 'abc' }, 'Quick App Demo');
    </script>
</body>
</html>
```

#### 厂商支持明细

| 厂商 | 支持版本 | 备注 |
| :--- | :--- | :--- |
| 小米 | 1000+ | - |
| 华为 | 1010+ | 需 EMUI 8.2+；暂不支持 `confirm` 参数 |
| OPPO | 1000+ | 需 ColorOS 2.1+ |
| vivo | 1000+ | - |
| 一加 | 1040+ | 需 Android 10+ |
| 努比亚| 1000+ | - |
| 海信 | 1030+ | - |
| 中兴 | - | - |
| 金立 | - | - |
| 联想 | - | - |
| 魅族 | - | - |

---

## 2. 检测平台能力 `channelReady()`

调用 `channelReady(callback)` 函数来检测当前环境（手机厂商系统）是否支持快应用服务。

#### 参数说明

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| `callback` | `Function` | 是 | 回调函数。平台支持快应用则回调参数为 `true`，否则为 `false`。 |

#### 示例代码

```html
<!DOCTYPE html>
<html>
<head>
    <title>能力检测示例</title>
    <script type="text/javascript" src="//statres.quickapp.cn/quickapp/js/routerinline.min.js"></script>
</head>
<body>
    <script type="text/javascript">
        channelReady(function(isAvailable) {
            alert('当前设备是否支持快应用服务：' + isAvailable);
        });
    </script>
</body>
</html>
```

#### 厂商支持明细

| 厂商 | 支持版本 | 备注 |
| :--- | :--- | :--- |
| 小米 | 1000+ | 需 MIUI 稳定版 v9.5+ 或 开发版 8.2+ |
| OPPO | 1000+ | 需 ColorOS 2.1+ |
| vivo | 1000+ | 需 Android 8.0+ |
| 一加 | 1040+ | 需 Android 10+ |
| 海信 | 1030+ | - |
| 华为 | - | 华为暂不支持准确的能力检测，`channelReady` 在所有安卓设备上都会返回 `true`。 |
| 中兴 | - | - |
| 金立 | - | - |
| 联想 | - | - |
| 魅族 | - | - |
| 努比亚| - | - |

> **重要**：由于无法 100% 准确检测跳转能力，开发者**必须做好 fallback 逻辑**，确保在跳转失败或不正常的情况下，H5 页面依然能为用户提供完整的服务。

---

## 3. 快应用码

**快应用码**本质上是一个承载了跳转逻辑的官方 H5 页面，通常以便于分享的二维码形式传播。它允许开发者在没有自己部署 Web 页面的情况下，也能拥有一个跳转到快应用的入口。

#### 地址格式
快应用码的 URL 格式与 `https` 协议的 `deeplink` 一致：
`https://hapjs.org/app/<package>/[path][?key=value]`

-   `<package>`: (必选) 应用包名。
-   `[path]`: (可选) 应用内页面的 `path`，默认为首页。
-   `[?key=value]`: (可选) 希望传递给页面的参数，可以有多个。

#### 如何生成

1.  **快应用内生成**：调用 `app.createQuickAppQRCode()` API。
2.  **开发者后台生成**：在快应用开发者后台的“快应用码”页面进行配置和生成。
3.  **手动拼接**：根据上述地址格式自行组合 URL。
