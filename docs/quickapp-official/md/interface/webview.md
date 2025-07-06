
# `system.webview` API 文档

## 接口声明
```json
{ "name": "system.webview" }
```

## 导入模块
```javascript
import webview from '@system.webview'
// 或者
const webview = require('@system.webview')
```

---

## 接口定义

### `webview.loadUrl(OBJECT)`
打开一个网页。

**说明**:
-   打开的网页标题栏样式与当前页面的标题栏样式相同。
-   Webview 的 User-Agent 字符串后会追加额外内容，格式为：`hap/<平台版本号>/<厂商标识> <平台应用包名>/<平台应用版本号> <应用名>/<应用版本号> (<来源信息>)`。“来源信息”与 `app.getInfo()` 返回结果中的 `source` 字段相同。

- **参数**
    | 参数名 | 类型 | 必填 | 说明 |
    | :--- | :--- | :--- | :--- |
    | `url` | `String` | 是 | 要加载的页面 URL。 |
    | `allowthirdpartycookies` (1030+) | `Boolean` | 否 | 是否支持第三方 cookies。设置为 `true` 时开启。**注意**：此参数仅支持 Android 5.0 及以上系统，5.0 以下默认为 `true`。 |
    | `showloadingdialog` (1070+) | `Boolean` | 否 | 是否展示默认的加载中对话框，默认值为 `false`。 |
    | `useragent` (1091+) | `String` | 否 | 设置 Web 组件的 User-Agent。<ul><li>`system`: 使用系统默认 UA。</li><li>其他字符串: 自定义 UA。</li><li>不设置或为空: 使用快应用默认 UA。</li></ul> |

- **示例**
    ```javascript
    webview.loadUrl({
      url: 'https://www.example.com',
      allowthirdpartycookies: true,
      showloadingdialog: true
    });
    ```

### `webview.setCookie(OBJECT)` (1100+)
为 WebView 设置 Cookie。

- **参数**
    | 参数名 | 类型 | 必填 | 说明 |
    | :--- | :--- | :--- | :--- |
    | `domain` | `String` | 是 | Cookie 设置的域名。 |
    | `name` | `String` | 是 | Cookie 的名称。 |
    | `value` | `String` | 否 | Cookie 的值。 |
    | `path` | `String` | 否 | Cookie 的路径，默认为 `/`。 |
    | `expires` | `String` | 否 | Cookie 的过期时间，必须是 GMT 格式的字符串。 |
    | `maxAge` | `String` | 否 | Cookie 的最大生命周期（秒）。`maxAge` 的优先级高于 `expires`。 |
    | `extra` | `String` | 否 | Cookie 的其他额外信息。 |
    | `success` | `Function`| 否 | 调用成功的回调函数。 |
    | `fail` | `Function` | 否 | 调用失败的回调函数。 |

- **示例**
    ```javascript
    webview.setCookie({
      domain: '.example.com',
      name: 'session_id',
      value: 'abc123xyz',
      maxAge: '3600', // 1 hour
      path: '/',
      success: function() {
        console.log('Set cookie success');
      },
      fail: function(error, code) {
        console.log(`Set cookie fail, code = ${code}`);
      }
    });
    ```

---

## WebView 内部 API
在通过 `webview.loadUrl` 打开的网页中，可以通过 `system` 对象调用以下 API。

### `system.go(path)`
从网页中跳转到当前快应用的指定页面。

- **参数**
    | 参数名 | 类型 | 必填 | 说明 |
    | :--- | :--- | :--- | :--- |
    | `path` | `String` | 是 | 要跳转的应用内页面路径，可携带参数，例如 `/detail?param1=value1`。特殊地，若 `path` 为 `/`，则跳转到 path 为 `/` 的页面，若无则跳转到首页。 |

- **示例**
    ```html
    <!-- 在网页的 HTML 中 -->
    <button onclick="system.go('/detail?param1=value1')">返回应用</button>
    ```

### 通过 Deep Link 打开快应用 (1060+)
在 webview 打开的网页中，支持通过 `deeplink` 打开快应用。

- **支持的格式**
    ```
    hap://app/<package>/[path][?key=value]
    http://hapjs.org/app/<package>/[path][?key=value]
    https://hapjs.org/app/<package>/[path][?key=value]
    ```

- **示例**
    ```html
    <!-- 在网页的 HTML 中 -->
    <a href="hap://app/org.hapjs.demo.sample/page?key=value">打开另一个快应用</a>
    <script>
      // 或者通过 JavaScript 跳转
      location.href = 'http://hapjs.org/app/org.hapjs.demo.sample/page?key=value';
    </script>
    ```

---

## 后台运行限制
**禁止使用**。后台运行详细用法参见后台运行脚本的官方文档。
