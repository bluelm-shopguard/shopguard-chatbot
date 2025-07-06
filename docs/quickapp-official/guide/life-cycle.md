
# 快应用生命周期详解

本文将详细介绍快应用中页面（ViewModel）和应用（App）的生命周期，帮助你更好地组织代码和管理资源。

通过本节，你将学会：

-   **页面的生命周期**: `onInit`, `onReady`, `onShow`, `onHide`, `onDestroy`, `onBackPress` 等核心事件。
-   **页面的状态**: 理解页面的显示、隐藏和销毁状态。
-   **App 的生命周期**: `onCreate`, `onDestroy` 等全局应用事件。

---

## 生命周期图示

![生命周期图](https://doc.quickapp.cn/assets/images/framework-lifecycle-1.554039f6.png)

---

## 一、页面的生命周期

页面的生命周期本质上是其 ViewModel 的生命周期。当一个页面被创建、显示、隐藏或销毁时，会触发相应的生命周期函数。

### `onInit()`

-   **触发时机**：ViewModel 的数据已经准备好。
-   **核心用途**：可以开始访问和操作页面 `private` 和 `public` 中定义的数据。这是进行数据初始化、网络请求等操作的理想位置。

```javascript
export default {
  private: {
    lcList: []
  },
  onInit () {
    this.$page.setTitleBar({ text: '生命周期' });
    this.lcList.push('onInit');
    console.info(`onInit 触发：可以访问页面数据 lcList: ${this.lcList}`);
    // 也可以访问 app.ux 中定义的数据和方法
    console.info(`访问应用数据: ${this.$app.$def.data1.name}`);
  }
}
```

### `onReady()`

-   **触发时机**：ViewModel 的模板已经编译完成，DOM 结构已生成。
-   **核心用途**：可以开始获取 DOM 节点（例如，通过 `this.$element('elementId')`）。

```javascript
onReady () {
  this.lcList.push('onReady');
  console.info('onReady 触发：可以获取 DOM 节点');
  const rootElement = this.$rootElement();
  console.info(`根节点信息: ${rootElement}`);
}
```

### `onShow()` 和 `onHide()`

-   **触发时机**：
    -   `onShow()`: 页面从隐藏状态变为显示状态时触发（包括首次进入页面）。
    -   `onHide()`: 页面从显示状态变为隐藏状态时触发（例如，跳转到新页面）。
-   **核心用途**：处理页面可见性变化相关的逻辑，如启动/停止动画、注册/注销需要前台运行的监听器等。
-   **页面状态判断**：可以通过 `this.$visible` (Boolean) 判断页面当前的显示状态。

```javascript
onShow () {
  this.lcList.push('onShow');
  console.info(`onShow 触发，页面可见状态 (this.$visible): ${this.$visible}`); // true
},
onHide () {
  this.lcList.push('onHide');
  console.info(`onHide 触发，页面可见状态 (this.$visible): ${this.$visible}`); // false
}
```

### `onDestroy()`

-   **触发时机**：页面被销毁时触发（例如，从当前页面返回上一页）。
-   **核心用途**：释放页面占用的资源，如清除定时器 (`clearTimeout`)、取消接口订阅 (`geolocation.unsubscribe()`) 等，防止内存泄漏。
-   **页面状态判断**：可以通过 `this.$valid` (Boolean) 判断页面是否已被销毁。

```javascript
onDestroy () {
  console.info('onDestroy 触发：页面即将被销毁，应在此处释放资源');
  // 注意：在 onDestroy 内部，this.$valid 仍然为 true。
  // 页面销毁后，任何绑定到该页面的异步操作（如 setTimeout）将不会执行。
}
```

### `onBackPress()`

-   **触发时机**：用户点击物理返回键或标题栏左上角的返回按钮时。
-   **核心用途**：拦截默认的返回行为，处理自定义逻辑（如提示用户保存草稿）。
-   **返回值**：
    -   `return true`: 拦截返回事件，页面不返回。开发者需要自己处理后续逻辑（如调用 `router.back()`）。
    -   无返回值或返回其他值：不拦截，遵循系统默认的返回行为。

```javascript
onBackPress () {
  console.info('onBackPress 触发');
  // 返回 true 来阻止默认的返回操作
  // return true;
}
```

### `onMenuPress()`

-   **触发时机**：点击标题栏右侧的菜单按钮（旧版）或胶囊按钮（1070+）时。
-   **核心用途**：实现自定义的菜单功能，会拦截系统默认的菜单弹窗。
-   **注意**: OPPO 快应用暂不支持此生命周期。

```javascript
onMenuPress(){
  prompt.showToast({ message: `已拦截系统菜单` });
}
```

### 其他页面生命周期

-   `onRefresh(query)` (1050+): 当页面启动模式为 `singleTask` 且被再次打开时触发。
-   `onConfigurationChanged(event)` (1060+): 当应用配置变化时触发（如系统语言、主题模式改变）。
-   `onReachTop()` (1080+): 页面滚动到顶部时触发。
-   `onReachBottom()` (1080+): 页面滚动到底部时触发。
-   `onPageScroll(event)` (1080+): 页面滚动时触发，`event.scrollTop` 包含滚动距离。

---

## 二、APP 的生命周期 (在 `app.ux` 中定义)

`app.ux` 文件是应用的入口，可以在其中定义全局的生命周期函数和共享的数据/方法。

-   `onCreate()`: 应用创建时调用，只会执行一次。适合进行全局的初始化配置。
-   `onRequest()` (1070+): 应用被调起时调用。
-   `onShow()` (1070+): 应用切换到前台时调用。
-   `onHide()` (1070+): 应用切换到后台时调用。
-   `onDestroy()`: 应用销毁时调用。
-   `onError()` (1030+): 应用发生 javascript 错误时调用。
-   `onPageNotFound(params)` (1060+): 当 `router.push` 一个不存在的页面时调用。

### `app.ux` 示例

```javascript
// app.ux
export default {
  // 1. 生命周期
  onCreate() {
    console.info('Application onCreate');
  },
  onDestroy() {
    console.info('Application onDestroy');
  },

  // 2. 全局数据和方法
  // 在页面中通过 this.$app.$def.data1 访问
  data1: {
    name: '这是APP全局数据'
  },
  // 在页面中通过 this.$app.$def.method1() 调用
  method1() {
    console.info('这是APP的全局方法');
  }
}
```

在页面中，可以通过 `this.$app` 对象来访问 `app.ux` 中定义的内容。

-   `this.$app.$def`: 访问在 `app.ux` 中 `export default` 的对象，包含自定义的全局数据和方法。
-   `this.$app.$data`: 访问在 `manifest.json` 中 `config` 字段下定义的数据。

---

## 总结

-   **页面生命周期**用于管理单个页面的创建、显示/隐藏、销毁和用户交互。
-   **App 生命周期**用于管理整个应用的启动、前后台切换和销毁，以及处理全局事件。

深刻理解并善用这些生命周期函数，是构建健壮、高效的快应用的关键。
