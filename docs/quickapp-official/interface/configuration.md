
# `system.configuration` API 文档 (1060+)

## 接口声明
无需声明。

## 导入模块
```javascript
import configuration from '@system.configuration'
// 或者
const configuration = require('@system.configuration')
```

---

## 接口定义

### `configuration.getLocale()`
获取应用当前的语言环境。默认使用系统的语言环境，会因为设置或系统语言环境改变而发生变化。

- **参数**: 无

- **返回值**: 返回一个包含 `language` 和 `countryOrRegion` 的对象。
    | 参数名 | 类型 | 说明 |
    | :--- | :--- | :--- |
    | `language` | `String` | 语言 |
    | `countryOrRegion`| `String` | 国家或地区 |

- **示例**
    ```javascript
    const locale = configuration.getLocale();
    console.log(locale.language); // e.g., 'zh'
    console.log(locale.countryOrRegion); // e.g., 'CN'
    ```

---

### `configuration.setLocale(OBJECT)`
设置应用的语言环境。设置完成后，应用会按照新的语言环境来更新页面，并回调 `onConfigurationChanged` (1060+) 生命周期函数。

**注意**：当系统语言发生变化或应用重新进入时，当前语言环境会重置为系统语言。Web 组件与 Fetch 接口在请求 Header 中会携带对应的 `Accept-Language`。

- **参数**:
    | 类型 | 必填 | 说明 |
    | :--- | :--- | :--- |
    | `Object` | 是 | 要设置的 Locale 对象，包含 `language` 和 `countryOrRegion`。 |

- **示例**
    ```javascript
    configuration.setLocale({
      language: 'zh',
      countryOrRegion: 'CN'
    });
    ```

---

### `configuration.getThemeMode()` (1070+)
获取应用当前的主题模式。

- **参数**: 无

- **返回值**:
    返回当前主题模式值，类型为 `Number`。
    | 返回值 | 说明 |
    | :--- | :--- |
    | `0` | 日间模式 |
    | `1` | 夜间模式 |

    **注意**: 获取主题模式值会有两种情况：
    1.  如果 `manifest.json` 的 `display.themeMode` 值为 `-1` (跟随系统)，则此接口返回值也跟随系统主题模式，返回 `0` 或 `1`。
    2.  如果 `manifest.json` 的 `display.themeMode` 值为 `0` (日间模式)、`1` (夜间模式) 或未设置 (默认为 `0`)，则快应用为固定模式，此接口返回值与 manifest 配置保持一致。

- **示例**
    ```javascript
    const themeMode = configuration.getThemeMode();
    console.log(`Theme mode is ${themeMode} now~`);
    ```

---

### `configuration.setGrayMode(OBJECT)` (1100+)
设置灰色模式相关配置。通过该方法设置的配置项会覆盖 `manifest.json` 中的相应配置。

- **参数**:
    | 参数名 | 类型 | 必填 | 说明 |
    | :--- | :--- | :--- | :--- |
    | `enable` | `Boolean` | 否 | 是否开启灰色模式 |
    | `duration`| `Object` | 否 | 灰色模式需要启动的日期 |
    | `excludedPages`| `Array` | 否 | 需要禁用灰色模式的页面列表 (字符串数组) |

- **`duration` 对象说明**:
    | 参数名 | 类型 | 必填 | 说明 |
    | :--- | :--- | :--- | :--- |
    | `regular` | `Array` | 否 | 每年固定的日期，日期格式为 `"MM/dd"` |
    | `temporary` | `Array` | 否 | 一次性的临时日期，日期格式为 `"yyyy/MM/dd"` |

- **返回值**: 无

- **示例**
    ```javascript
    configuration.setGrayMode({
        enable: true,
        duration: {
            regular: ["12/13"],
            temporary: ['2020/09/12']
        },
        excludedPages: ["/ImageDemo"]
    });
    ```

---

## 后台运行限制
无限制。后台运行详细用法参见后台运行脚本的官方文档。
