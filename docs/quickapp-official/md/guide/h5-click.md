
# H5 点击组件使用指南

H5 点击组件是快应用官方推荐的、用于在 H5 页面中跳转到指定快应用的标准方式。**该组件必须由用户主动点击后**才能发起跳转请求，从而保障了用户体验。开发者可以完全自定义组件的 UI 样式，并在一个页面中使用多个不同的点击组件。

---

## 1. 引入 JS 文件

首先，在你的网页 `<head>` 或 `<body>` 的末尾嵌入以下 JS 脚本：

```html
<script type="text/javascript" src="//statres.quickapp.cn/quickapp/js/qa_router.min.js"></script>
```

---

## 2. 检测环境支持 `channelReady()`

在使用组件前，可以通过 `channelReady(callback)` 函数检测当前设备环境是否支持快应用服务。

-   **参数**:
    -   `callback` (`Function`): **必需**。一个回调函数，如果当前平台支持快应用服务，则其接收到的参数为 `true`，否则为 `false`。

-   **示例**:
    ```javascript
    channelReady(function(isAvailable) {
      if (isAvailable) {
        console.log('当前设备支持快应用服务。');
      } else {
        console.log('当前设备不支持快应用服务。');
      }
    });
    ```

-   **厂商支持明细**:
    > (注意：此处的支持情况与旧版 URL 跳转配置类似)

| 厂商 | 支持版本 | 备注 |
| :--- | :--- | :--- |
| 小米 | 1000+ | 需 MIUI 稳定版 v9.5+ 或 开发版 8.2+ |
| OPPO | 1000+ | 需 ColorOS 2.1+ |
| vivo | 1000+ | 需 Android 8.0+ |
| 一加 | 1040+ | 需 Android 10+ |
| 海信 | 1030+ | - |
| 华为 | - | 华为暂不支持准确的能力检测，`channelReady` 会始终返回 `true`。请务必做好 fallback 逻辑。 |

---

## 3. 使用并定制组件

在页面的合适位置插入 `<qa-router-button>` 标签，并通过 `data-*` 属性配置其行为，通过内部的 `<templates>` 和 `<styles>` 标签定制其外观。

### 结构示例
```html
<qa-router-button
  data-package-name="com.hybrid.demo.sample"
  data-page="/detail"
  data-params='{"id": 1, "from": "h5"}'
  data-design-params='{"fontSize": 16, "designWidth": 750}'
  data-click-event='{"eventName": "handleClickEvent", "eventParams": "anyString"}'
  data-expose-event='{"eventName": "handleExposeEvent", "eventParams": "anyString"}'
  style="display: inline-block; width: 200px; height: 50px;"
>
  <templates>
    <!-- 在这里插入自定义的 DOM 结构 -->
    <div id="container">
      <img src="icon.png" alt="icon" />
      <button>秒开应用</button>
    </div>
  </templates>
  <styles>
    <!-- 在这里插入自定义的 CSS 样式 -->
    #container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background-color: #4285f4;
      border-radius: 8px;
    }
    img { width: 24px; height: 24px; margin-right: 8px; }
    button {
      border: none;
      background: none;
      color: white;
      font-size: 16px;
    }
  </styles>
</qa-router-button>

<script>
  // 点击事件回调
  function handleClickEvent(params) {
    console.log('Button clicked!', params);
    // 可在此处上报点击数据
  }

  // 组件曝光事件回调
  function handleExposeEvent(params) {
    console.log('Button exposed!', params);
    // 可在此处上报曝光数据
  }
</script>
```

### 参数说明
| 属性 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| `data-package-name` | `String` | 是 | 快应用的包名。 |
| `data-page` | `String` | 否 | 要跳转的页面路径。不传则打开首页。 |
| `data-params` | `String` | 否 | JSON 字符串格式的参数，透传给目标页面。 |
| `data-design-params` | `String` | 否 | JSON 字符串，用于 rem 适配。`{"fontSize": 16,"designWidth": 1080}` |
| `data-click-event` | `String` | 否 | JSON 字符串，配置点击事件回调。`{"eventName": "...", "eventParams": "..."}` |
| `data-expose-event`| `String` | 否 | JSON 字符串，配置组件曝光事件回调。`{"eventName": "...", "eventParams": "..."}` |

### 厂商支持明细

| 厂商 | 支持版本 | 备注 |
| :--- | :--- | :--- |
| 小米 | 1000+ | - |
| 华为 | 1010+ | 需 EMUI 8.2+ |
| OPPO | 1000+ | 需 ColorOS 2.1+ |
| vivo | 1000+ | - |
| 一加 | 1040+ | 需 Android 10+ |
| 努比亚| 1000+ | - |
| 海信 | 1030+ | - |

---

## 4. 组件内部限制

出于安全和性能考虑，组件内部允许使用的标签和样式是有限的。

- **可用标签**: `div`, `p`, `img`, `span`, `button`, `a`, `br`, `ol`, `ul`, `li`, `dl`, `dt`, `dd`, `h1-h6`。
- **可用样式**: 支持布局、边框、背景、文本、Flexbox、定位等常用样式。详细列表请参考官方文档。
- **网络请求限制**: 组件内部发起的网络请求（如 `background-image`）只支持 `https` 协议。

---

## 5. 在前端框架中使用

### Vue.js
为了防止 Vue 将 `<qa-router-button>` 及其子标签识别为 Vue 组件而报错，需要在 `main.js` 中配置 `ignoredElements`。
```javascript
// Vue 2.x
Vue.config.ignoredElements = [/^qa-router-button|templates|styles/];

// Vue 3.x
const app = createApp(App);
app.config.compilerOptions.isCustomElement = tag => tag.startsWith('qa-router-button') || tag === 'templates' || tag === 'styles';
app.mount('#app');
```

### React
在 React (JSX) 中使用时，`<styles>` 标签不可用。样式需要通过内联 `style` 对象或 `className` 的方式来应用。

```jsx
class H5ClickDemo extends React.Component {
  render() {
    const containerStyle = { display: 'flex' };
    const btnStyle = { backgroundColor: 'red' };
    return (
      <qa-router-button
        data-package-name="com.hybrid.demo.sample"
        style={{ height: '2rem' }}
      >
        <templates is="x3d">
          <div id="container" style={containerStyle}>
            <button style={btnStyle}>秒开</button>
          </div>
        </templates>
      </qa-router-button>
    );
  }
}
```

---

## FAQ

- **Q: 组件闪动如何解决?**
  **A:** 在 `<qa-router-button>` 标签上直接设置最终的宽高样式，或在 `<templates>` 和 `<styles>` 节点上增加 `display: none` 样式，待内部渲染完成后再显示。
- **Q: 是否支持动态修改包名?**
  **A:** 不支持。如需跳转不同应用，请使用多个组件并用 `v-if` 或类似逻辑动态切换。
- **Q: 小程序 web-view 中如何使用?**
  **A:** 在小程序管理后台，将 `statres.quickapp.cn` 添加到业务域名白名单中。
