
# 页面切换及参数传递

本节将详细介绍在快应用中如何通过 `<a>` 组件和 `router` 接口进行页面跳转、传递参数、接收参数以及实现页面间的数据回传。

通过本节，你将学会：

-   使用 `<a>` 组件切换页面和传递参数
-   使用 `router` 接口切换页面和传递参数
-   在新页面中如何接收传递过来的参数
-   如何实现页面返回时向上一个页面回传参数

---

## 1. 通过 `<a>` 组件切换页面

`<a>` 组件是最简单的页面跳转方式，通过设置 `href` 属性即可。

### 跳转到应用内页面

`href` 的值可以是指向应用内页面的路径。

```xml
<template>
  <div class="container">
    <!-- 推荐：以'/'开头的完整页面路径 -->
    <a href="/NextPage/ReceiveParams">跳转到接收参数页面</a>

    <!-- 也支持省略开头的'/' -->
    <a href="NextPage/ReceiveParams">跳转到接收参数页面</a>

    <!-- 特殊值'/'：跳转到在 manifest.json 中 path 定义为'/'的页面，若无则跳转到首页 -->
    <a href="/">跳转到首页</a>
  </div>
</template>
```

### 调起系统功能或加载网页

`<a>` 组件还支持通过 schema URL 调起系统功能或在 webview 中加载网页。

```xml
<template>
  <div class="container">
    <a href="tel:10086">调起电话</a>
    <a href="sms:10086">调起短信</a>
    <a href="mailto:example@xx.com">调起邮件</a>
    <a href="https://example.com">打开网页</a>
  </div>
</template>
```

### 传递参数

使用 `<a>` 组件跳转时，可以通过标准的 URL query 字符串 `?key=value&key2=value2` 的形式附加参数。参数值也支持数据绑定。

```xml
<template>
  <div class="container">
    <!-- 传递静态参数 -->
    <a href="/NextPage/ReceiveParams?id=123&from=home">携带固定参数跳转</a>

    <!-- 传递动态参数 -->
    <a href="/NextPage/ReceiveParams?title={{title}}">携带动态参数跳转</a>
  </div>
</template>

<script>
  export default {
    private: {
      title: 'Hello World!'
    }
  }
</script>
```

---

## 2. 通过 `router` 接口切换页面

`@system.router` 接口提供了更强大和灵活的编程式导航能力。使用前需要先导入模块。

```javascript
import router from '@system.router';
```

### 核心 API

-   `router.push({ uri, params })`: 跳转到新页面，并将当前页面压入历史栈。
-   `router.replace({ uri, params })`: 跳转到新页面，但会替换掉历史栈中的当前页面（即无法返回到当前页）。
-   `router.back()`: 返回上一页。
-   `router.clear()`: 清空历史栈，仅保留当前页面作为栈底。

### 跳转与传递参数示例

`router` 接口通过 `params` 对象来传递参数，这是更推荐的方式。

```xml
<template>
  <div class="container">
    <input type="button" value="跳转并传参 (push)" onclick="routePagePushWithParams"></input>
    <input type="button" value="跳转并传参 (replace)" onclick="routePageReplaceWithParams"></input>
    <input type="button" value="返回上一页" onclick="routePageBack"></input>
  </div>
</template>

<script>
  import router from '@system.router';

  export default {
    private: {
      user: {
        name: 'Alice',
        id: 1001
      }
    },
    routePagePushWithParams() {
      // 跳转到新页面，并传递一个对象作为参数
      router.push({
        uri: '/NextPage/ReceiveParams',
        params: { user: this.user, type: 'push' }
      });
    },
    routePageReplaceWithParams() {
      // 替换当前页，并传递参数
      router.replace({
        uri: '/NextPage/ReceiveParams',
        params: { user: this.user, type: 'replace' }
      });
    },
    routePageBack() {
      router.back();
    }
  }
</script>
```

---

## 3. 接收参数

无论通过 `<a>` 组件还是 `router` 接口传递参数，目标页面的接收方式是完全相同的：**在目标页面的 ViewModel 中声明同名属性**。

-   **`protected`**: 推荐使用。在 `protected` 中声明的属性，只允许被**应用内部**的页面请求传递的数据覆盖。
-   **`public`**: 在 `public` 中声明的属性，允许被**应用内外部**（如 deeplink）的请求传递的数据覆盖。

**接收参数页面示例 (`/NextPage/ReceiveParams.ux`)**

```xml
<template>
  <div class="container">
    <text>接收到的参数:</text>
    <!-- 在模板中直接使用声明的属性 -->
    <text>User Name: {{user.name}}</text>
    <text>User ID: {{user.id}}</text>
    <text>Type: {{type}}</text>
  </div>
</template>

<script>
  export default {
    // 使用 protected 声明要接收的参数，并可以设置默认值
    protected: {
      user: {},
      type: 'unknown'
    },
    onInit() {
      // 在 JS 中也可以直接访问这些属性
      console.info('Received user:', this.user);
      console.info('Received type:', this.type);
    }
  }
</script>
```

---

## 4. 回传参数

有时会遇到这样的场景：从页面 A 跳转到 B，在 B 操作完成后返回 A，并需要将一些数据带回给 A。由于 `router.back()` 不支持传参，我们可以借助 `app.ux` 作为全局数据中转站来实现。

#### 步骤 1: 在 `app.ux` 中定义全局数据存取方法

```javascript
// app.ux
export default {
  onCreate() {
    // 初始化一个全局数据缓存对象
    this.dataCache = {};
  },
  setAppData(key, value) {
    this.dataCache[key] = value;
  },
  getAppData(key) {
    const value = this.dataCache[key];
    // 可选：实现 "阅后即焚"，取一次后就删除，防止数据污染
    delete this.dataCache[key];
    return value;
  }
}
```

#### 步骤 2: 页面 B 在返回前写入数据

在页面 B，当用户完成操作准备返回时（例如在 `onHide` 或某个按钮的点击事件中），将需要回传的数据写入 `app.ux`。

```javascript
// pageB.ux
export default {
  private: {
    msgToA: '这是从B页面返回的数据'
  },
  onHide() {
    // 页面隐藏时（通常是返回或跳转到其他页面时），写入数据
    this.$app.setAppData('dataFromB', this.msgToA);
  }
}
```

#### 步骤 3: 页面 A 在 `onShow` 中读取数据

页面 A 在每次被显示时 (`onShow` 生命周期)，都去检查 `app.ux` 中是否有页面 B 回传的数据。

```javascript
// pageA.ux
export default {
  private: {
    msgFromB: '等待B页面返回数据...'
  },
  onShow() {
    // 页面显示时，尝试获取回传的数据
    const data = this.$app.getAppData('dataFromB');
    if (data) {
      this.msgFromB = data;
    }
  }
}
```
