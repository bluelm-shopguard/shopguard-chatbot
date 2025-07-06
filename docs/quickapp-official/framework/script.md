
# 快应用 Script 脚本指南

`<script>` 部分负责定义页面的数据模型、业务逻辑和生命周期回调函数。它采用标准的 **ES6** 语法。

## 模块与代码引用

### 系统模块声明

通过 `import` 关键字引入框架提供的系统功能模块。

```javascript
import fetch from '@system.fetch';
```

### 本地代码引用

同样使用 `import` 引入项目内的公共 JS 文件。

```javascript
import utils from '../Common/utils.js';
```

> **注意**：快应用环境并非 Node.js 环境，请勿引用 Node.js 的原生模块（如 `fs`）。

---

## ViewModel 对象定义

`export default {}` 中定义的对象是页面的 ViewModel (VM)，包含了数据、方法和生命周期函数。页面级组件和自定义组件的定义略有不同。

### 页面级组件

| 属性 | 类型 | 描述 |
|:---|:---|:---|
| `public` (1000+) | Object | **推荐**。定义公共数据，允许被外部传入的数据覆盖。 |
| `protected` (1000+) | Object | **推荐**。定义受保护数据，只允许被应用内部的页面跳转覆盖。 |
| `private` (1000+) | Object | **推荐**。定义私有数据，**不允许**被任何外部数据覆盖。 |
| `computed` (1050+) | Object | 定义计算属性。 |
| `data` | Object / Function | **不推荐**。旧版数据定义方式，存在安全风险，会被 `public` 等新方式取代。 |

### 自定义组件

| 属性 | 类型 | 描述 |
|:---|:---|:---|
| `props` | Array / Object | 定义组件可从外部接收的所有属性。 |
| `computed` (1050+) | Object | 定义计算属性。 |
| `externalClasses` (1100+) | Array | 定义可由外部传入的样式类名。 |
| `data` | Object / Function | 定义组件内部的响应式数据。 |

#### `props` 验证 (1010+)

为了增加组件的健壮性，可以为 `props` 定义带有验证规则的对象。

```javascript
export default {
  props: {
    // 必填的字符串
    propA: { type: String, required: true },
    // 带默认值的数字
    propB: { type: Number, default: 100 },
    // 对象或数组的默认值必须从一个工厂函数获取
    propC: {
      type: Object,
      default: () => ({ message: 'hello' })
    },
    // 自定义验证函数
    propD: {
      validator: (value) => ['success', 'warning', 'danger'].includes(value)
    }
  }
}
```

#### 计算属性 `computed` (1050+)

用于派生新的数据，结果会被缓存，仅在依赖的响应式属性变化时重新计算。

```javascript
export default {
  data: { firstName: 'Quick', lastName: 'App' },
  computed: {
    fullName: {
      get() { return `${this.firstName} ${this.lastName}`; },
      set(newValue) {
        const names = newValue.split(' ');
        this.firstName = names[0];
        this.lastName = names[names.length - 1];
      }
    }
  }
}
```

#### 外部样式 `externalClasses` (1100+)

允许父组件将一个或多个 class 名传递给子组件的特定元素。

**父组件**:
```xml
<custom-component my-class="red-text"></custom-component>
```
**子组件**:
```xml
<!-- 子组件的 template -->
<text class="my-class">Text color is controlled by parent.</text>

<!-- 子组件的 script -->
<script>
export default {
  externalClasses: ['my-class']
}
</script>
```

---

## 公共对象和方法

在页面的 VM 实例中，可以通过 `this` 访问一系列内置的对象和方法。

### 公共对象

| 对象 | 描述 |
|:---|:---|
| `this.$app` | 全局应用对象，可访问 `app.ux` 中定义的内容 (`$def`)。 |
| `this.$page` | 当前页面对象，可访问页面信息（如 `uri`, `path`）和方法。 |
| `this.$attrs` (1090+) | 获取父组件传递的、但未在 `props` 中声明的属性。 |
| `this.$listeners` (1090+) | 获取父组件绑定的、非原生的事件监听器。 |

### 数据方法

| 方法 | 描述 |
|:---|:---|
| `this.$set('key', value)` | 向响应式对象中添加一个属性。 |
| `this.$delete('key')` | 从响应式对象中删除一个属性。 |

### 公共方法

| 方法 | 描述 |
|:---|:---|
| `this.$element('id')` | 获取指定 id 的组件 DOM 对象。 |
| `this.$child('id')` | 获取指定 id 的自定义组件的 ViewModel 实例。 |
| `this.$nextTick(callback)`| 在下次 DOM 更新循环结束后执行回调。 |

### 事件方法

| 方法 | 描述 |
|:---|:---|
| `this.$on('event', handler)` | 监听当前实例上的自定义事件。 |
| `this.$off('event', handler)` | 移除自定义事件监听器。 |
| `this.$emit('event', data)`| 触发当前实例上的事件。 |
| `this.$dispatch('event')` | 向父级组件派发事件（冒泡）。 |
| `this.$broadcast('event')` | 向所有后代组件广播事件。 |
| `this.$watch('prop', handler)` | 侦听一个表达式或属性的变化。 |

---

## 生命周期接口

### 页面生命周期

| 接口 | 触发时机 |
|:---|:---|
| `onInit(query)` | 页面初始化时，在 `onReady` 之前，只触发一次。`query` 是页面参数。 |
| `onReady()` | 页面创建完成可以显示时，只触发一次。 |
| `onShow()` | 页面进入或从后台返回前台显示时。 |
| `onHide()` | 页面离开或进入后台时。 |
| `onDestroy()` | 页面被销毁时。 |
| `onBackPress()` | 用户点击返回按钮时。返回 `true` 可阻止默认返回行为。 |
| `onMenuPress()` | 用户点击菜单按钮时。返回 `true` 可阻止默认菜单。 |
| `onRefresh(query)` (1050+) | `launchMode` 为 `singleTask` 的页面被再次打开时。 |
| `onConfigurationChanged(evt)` (1060+) | 应用配置变化时（如系统语言、主题、屏幕方向等）。 |

### 应用生命周期 (在 `app.ux` 中定义)

| 接口 | 触发时机 |
|:---|:---|
| `onCreate()` | 应用首次创建时。 |
| `onRequest()` (1070+) | 应用收到外部打开新页面的请求时。 |
| `onShow()` (1070+) | 应用从后台返回前台时。 |
| `onHide()` (1070+) | 应用退到后台时。 |
| `onDestroy()` | 应用被销毁时。 |
| `onError(err)` (1030+) | 应用捕获到未处理的 JS 异常时。 |
| `onPageNotFound(params)` (1060+) | 页面路由跳转失败时。 |

### 自定义组件生命周期 (1050+)

| 接口 | 触发时机 |
|:---|:---|
| `onInit()` | 组件数据初始化完成时。 |
| `onReady()` | 组件模板创建完成时。 |
| `onDestroy()`| 组件被销毁时。 |

---

## 消息通道 (BroadcastChannel) (1000+)

用于实现**不同页面之间**的通信。

```javascript
// 页面 A (发送者)
const channelA = new BroadcastChannel('my-channel');
channelA.postMessage({ text: 'Hello from Page A' });
channelA.close(); // 发送完后可关闭

// 页面 B (接收者)
const channelB = new BroadcastChannel('my-channel');
channelB.onmessage = function(event) {
  console.log('Received:', event.data.text); // "Hello from Page A"
};
// 页面销毁时，也应调用 channelB.close()
```

---

## 框架前端插件 (1060+)

插件机制允许开发者通过 AOP（面向切面编程）的方式，在不侵入业务代码的情况下，监听全局生命周期，用于埋点、日志等场景。

**定义插件 (`plugin.js`)**:
```javascript
const MyPlugin = {
  install(VmClass) {
    // 监听所有页面的生命周期
    VmClass.mixin({
      onShow() { console.log(`Page Show: ${this.$page.path}`); }
    });
    // 监听应用的生命周期
    VmClass.mixinApp({
      onCreate() { console.log('App Created'); }
    });
  }
};
export default MyPlugin;
```

**在 `app.ux` 中引入插件**:
```javascript
import MyPlugin from './plugin.js';
export default {
  plugins: [MyPlugin]
};
```
