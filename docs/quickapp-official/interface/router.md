
# `system.router` API 文档

## 接口声明
无需声明。

## 导入模块
```javascript
import router from '@system.router'
// 或者
const router = require('@system.router')
```

---

## 接口定义

### `router.push(OBJECT)`
跳转到应用内的某个页面，页面栈层数没有限制。

**注意**：不能跳转到 `tabBar` 页面。

- **参数**
    | 参数 | 类型 | 必填 | 说明 |
    | :--- | :--- | :--- | :--- |
    | `uri` | `String` | 是 | 要跳转的目标 URI。 |
    | `params` | `Object` | 否 | 跳转时需要传递的数据。 |

- **`uri` 详细说明**
    `uri` 可以是以下格式：
    1.  **包含 schema 的完整 URI**：
        -   支持 `tel`, `sms`, `mailto`。例如 `tel:10086`。
        -   对于 `http/https`，会用内置的 web 页面打开。
        -   对于 `internal`，会根据文件扩展名调用系统应用打开。
        -   对于 `hap`，会跳转到对应的快应用页面。
    2.  **应用内页面路径**：以 `/` 开头，例如 `/about`。
    3.  **应用内页面名称**：不以 `/` 开头，例如 `About`。
    4.  **特殊值**：`uri` 为 `/` 时，跳转到 `path` 为 `/` 的页面，若无则跳转到首页。

- **`params` 详细说明**
    在目标页面中，可以通过 `this.paramName` 的方式获取参数值（值会被统一转为 String 类型）。使用前需要在目标页面的 `public` 或 `protected` 中定义同名属性。
    | 参数名 | 类型 | 说明 |
    | :--- | :--- | :--- |
    | `body` (1040+) | `String` | 跳转到短信发送页面时携带的短信内容。 |
    | `___PARAM_LAUNCH_FLAG___` (1050+) | `String` | 快应用启动参数，目前仅支持 `"clearTask"`，启动目标页时会清除栈中所有其他页面。 |
    | `___PARAM_PAGE_ANIMATION___` (1070+) | `Object` | 页面跳转动画类型，详见下方说明。 |

- **`___PARAM_PAGE_ANIMATION___` 参数说明**
    | 页面动作 | 动画类型 (`String`) | 说明 |
    | :--- | :--- | :--- |
    | `openEnter` | `slide`, `none` | **打开进入**新页面时，新页面的动画。默认 `slide`。 |
    | `closeEnter`| `slide`, `none` | **关闭返回**到当前页时，当前页的动画。默认 `slide`。 |
    | `openExit` | `slide`, `none` | **打开离开**当前页时，当前页的动画。默认 `slide`。 |
    | `closeExit` | `slide`, `none` | **关闭退出**当前页时，当前页的动画。默认 `slide`。 |

- **示例**
    ```javascript
    // 唤醒电话
    router.push({ uri: 'tel:10086' });

    // 发送短信
    router.push({ uri: 'sms:10086', params: { body: 'message' } });

    // 应用内切换页面 (通过路径)
    router.push({ uri: '/about', params: { testId: '1' } });

    // 切换页面并清除其他页面 (1050+)
    router.push({ uri: '/about', params: { ___PARAM_LAUNCH_FLAG___: 'clearTask' } });

    // 打开网页
    router.push({ uri: 'http://www.example.com' });

    // 打开另一个快应用
    router.push({ uri: 'hap://app/com.example.quickapp/page?key=value' });

    // 配置跳转动画 (1070+)
    router.push({
      uri: '/about',
      params: {
        ___PARAM_PAGE_ANIMATION___: {
          openEnter: 'none',
          closeEnter: 'slide',
          openExit: 'slide',
          closeExit: 'slide'
        }
      }
    });
    ```

---

### `router.replace(OBJECT)`
跳转到应用内的某个页面，**替换**当前页面（即当前页面无法返回）。

**注意**：不能跳转到 `tabBar` 页面。

- **参数**
    | 参数 | 类型 | 必填 | 说明 |
    | :--- | :--- | :--- | :--- |
    | `uri` | `String` | 是 | 要跳转的目标 URI (应用内页面的路径或名称)。 |
    | `params` | `Object` | 否 | 跳转时需要传递的数据。 |

- **示例**
    ```javascript
    router.replace({
      uri: '/test',
      params: { testId: '1' }
    });
    ```

---

### `router.switchTab(OBJECT)` (1200+)
跳转到 `tabBar` 页面，并关闭其他所有非 `tabBar` 页面。

- **参数**
    | 参数 | 类型 | 必填 | 说明 |
    | :--- | :--- | :--- | :--- |
    | `uri` | `String` | 是 | 要跳转的 `tabBar` 页面路径 (必须在 `manifest.json` 中已定义)。 |
    | `params` | `Object` | 否 | 跳转时需要传递的数据。 |

- **示例**
    ```javascript
    router.switchTab({
      uri: '/home', // 假设 '/home' 是一个 tabBar 页面
      params: {
        tabName: 'profile'
      }
    });
    ```

---

### `router.back(OBJECT)`
返回指定页面或上一页面。

- **参数**
    | 参数 | 类型 | 必填 | 说明 |
    | :--- | :--- | :--- | :--- |
    | `path` (1020+) | `String` | 否 | 返回目标页面的路径。不传则返回上一页。特殊值 `/` 跳转到首页。若 `path` 无效或未匹配到已打开页面，则返回上一页。若匹配到多个，返回至最后打开的那个。 |

- **示例**
    ```javascript
    // 假设页面栈为 A -> B -> C -> D -> E
    // 在 E 页面调用，返回到 D 页面
    router.back();

    // 在 C 页面调用，返回到 A 页面
    router.back({ path: '/A' });
    ```

---

### `router.clear()`
清空所有历史页面记录，仅保留当前页面在栈中。

- **参数**: 无
- **示例**: `router.clear();`

---

### `router.getLength()`
获取当前页面栈的页面数量。

- **返回值**: `Number` - 页面数量。
- **示例**
    ```javascript
    const length = router.getLength();
    console.log(`Page stack length = ${length}`);
    ```

---

### `router.getState()`
获取当前页面的状态信息。

- **返回值**: `Object` - 包含当前页面信息的对象。
    | 参数名 | 类型 | 说明 |
    | :--- | :--- | :--- |
    | `index` | `Number` | 当前页面在页面栈中的位置（索引） |
    | `name` | `String` | 当前页面的名称 |
    | `path` | `String` | 当前页面的路径 |

- **示例**
    ```javascript
    const page = router.getState();
    console.log(`Page name = ${page.name}, path = ${page.path}`);
    ```

---

### `router.getPages()` (1070+)
获取当前页面栈列表。

- **返回值**: `Array` - 页面栈列表，数组的每一项都是一个描述页面的 `Object`。
    - **数组项**: `{ name: String, path: String }`

- **示例**
    ```javascript
    const stacks = router.getPages();
    if (stacks.length > 0) {
      console.log('栈底页面路径为：', stacks[0].path);
    }
    ```

---

## 后台运行限制
**禁止使用**。后台运行详细用法参见后台运行脚本的官方文档。
