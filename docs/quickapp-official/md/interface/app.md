
# `system.app` API 文档

## 接口声明
无需声明。

## 导入模块
```javascript
import app from '@system.app'
// 或者
const app = require('@system.app')
```

---

## 接口定义

### `app.getInfo()`
获取当前应用信息。

- **参数**: 无

- **返回值**: 返回一个包含应用信息的对象。
    | 参数名 | 类型 | 说明 |
    | :--- | :--- | :--- |
    | `packageName` (1050+) | `String` | 应用包名 |
    | `icon` (1050+) | `String` | 应用图标路径 |
    | `name` | `String` | 应用名称 |
    | `versionName` | `String` | 应用版本名称 |
    | `versionCode` | `Integer` | 应用版本号 |
    | `logLevel` | `String` | Log 级别 (e.g., "debug") |
    | `source` | `Object` | 应用来源，详见 `source` 对象说明 |

- **`source` 对象说明**
    | 参数名 | 类型 | 说明 |
    | :--- | :--- | :--- |
    | `packageName` | `String` | 来源 app 的包名 (一级来源) |
    | `type` | `String` | 来源类型 (二级来源)，值为 `shortcut`, `push`, `url`, `barcode`, `nfc`, `bluetooth`, `other` |
    | `extra` | `Object` | 来源其他信息，与 `type` 相关，详见 `extra` 对象说明 |

- **`extra` 对象说明**
    当 `type` 为 `shortcut` 时：
    | 参数名 | 类型 | 说明 |
    | :--- | :--- | :--- |
    | `scene` | `String` | 三级来源，表示快捷方式创建的场景。值为 `dialog` (平台内部策略 Dialog 弹窗创建)、`api` (API 接口调用创建)、`web` (H5 站接入流量切换，浏览时创建)、`other` |
    | `original` | `Object` | 原始来源 `source`，表示快捷方式创建时的来源 |

- **示例**
    ```javascript
    console.log(JSON.stringify(app.getInfo(), null, 2));
    ```
    **输出示例：**
    ```json
    {
      "packageName": "com.example.demo",
      "name": "demo",
      "versionName": "1.0.0",
      "versionCode": 1,
      "icon": "/Common/logo.png",
      "logLevel": "debug",
      "source": {
        "packageName": "org.hapjs.mockup",
        "type": "other",
        "extra": {}
      }
    }
    ```

---

### `app.createQuickAppQRCode()` (1070+)
生成快应用分享二维码。

- **参数**:
    | 参数名 | 类型 | 必填 | 说明 |
    | :--- | :--- | :--- | :--- |
    | `path` | `String` | 否 | 页面路径，可携带参数。 |
    | `success` | `Function` | 否 | 成功回调 |
    | `fail` | `Function` | 否 | 失败回调 |

- **`success` 返回值**:
    | 参数名 | 类型 | 说明 |
    | :--- | :--- | :--- |
    | `uri` | `String` | 二维码文件地址 |

- **`fail` 返回错误代码**:
    | 错误码 | 说明 |
    | :--- | :--- |
    | 200 | 运行错误 |

- **示例**:
    ```javascript
    app.createQuickAppQRCode({
      path: '/component/basic/image?key1=value1&key2=value2',
      success: function(data) {
        console.log(`handling success: ${data.uri}`);
        // e.g., display the QR code image using the uri
      },
      fail: function(data, code) {
        console.log(`handling fail, code = ${code}`);
      }
    });
    ```

---

## 后台运行限制
无限制。后台运行详细用法参见后台运行脚本的官方文档。
