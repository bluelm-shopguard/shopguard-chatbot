# 快应用组件化开发指南

本节将详细介绍如何创建和使用自定义组件，以及父子组件、兄弟组件之间如何进行通信。

通过本节，你将学会：

* 如何自定义一个组件
* 如何在一个页面中引入自定义组件
* 父子组件之间的通信方式 (`props`, `$emit`, `$dispatch`)
* 兄弟或跨级组件的通信方案

---

## 1. 什么是自定义组件

在开发复杂页面时，如果将所有 UI 和逻辑都写在同一个 `.ux` 文件中，代码将变得难以维护和复用。**自定义组件**允许你将页面拆分成独立的、可复用的功能模块。

每个自定义组件都像一个迷你的页面，拥有自己的 `<template>`、`<style>` 和 `<script>`，可以管理自己的数据、方法和生命周期。从这个角度看， **页面本身也是一种特殊的、顶级的自定义组件** 。

### 自定义一个组件

创建一个自定义组件与创建一个页面非常相似，但有几点核心区别：

* **数据模型** : 在自定义组件的 `<script>` 中，数据必须定义在 `data` 属性里，而不能使用 `private` 或 `protected`。`data` 可以是一个对象，或者是一个返回对象的函数（推荐）。
* **对外通信** : 通过 `props` 接收父组件的数据。

**示例：一个简单的子组件 (`/components/part1.ux`)**

```xml
<template>
  <div class="comp-container">
    <text class="comp-title">我是一个自定义组件</text>
    <text>来自组件内部的数据: {{ say }}</text>
  </div>
</template>

<style>
  .comp-container {
    border: 1px solid #ccc;
    padding: 10px;
    margin: 10px;
  }
  .comp-title {
    font-weight: bold;
  }
</style>

<script>
  export default {
    // 推荐使用函数形式，避免多实例间数据引用污染
    data() {
      return {
        say: 'Hello Component!'
      }
    },
    onInit() {
      console.log('子组件 part1 已初始化');
    }
  }
</script>
```

---

## 2. 引入组件

在父组件或页面中，使用 `<import>` 标签来引入一个自定义组件。

* `src`: 指定组件文件的相对路径。
* `name`: 定义一个在 `<template>` 中使用的标签名。

**示例：在页面中引入 `part1` 组件**

```xml
<!-- page.ux -->
<import name="comp-part1" src="../components/part1.ux"></import>

<template>
  <div class="page-container">
    <text>这是一个页面</text>
    <!-- 使用 <import> 中定义的 name 作为标签名 -->
    <comp-part1></comp-part1>
  </div>
</template>

<script>
  export default {
    onInit() {
      this.$page.setTitleBar({ text: '引入组件示例' });
    }
  }
</script>
```

---

## 3. 父子组件通信

组件通信是组件化开发的核心。

### 父组件 -> 子组件 (Props)

父组件通过 **Props** 向子组件传递数据。

1. **子组件** : 在 `props` 数组中声明需要从外部接收的属性名。
2. **父组件** : 在使用子组件的标签上，通过 `属性名="{{变量}}"` 的方式将数据绑定并传递给子组件。属性名需要使用 kebab-case (短横线命名法)，如 `propObject` 对应 `prop-object`。

**示例:**

```xml
<!-- 子组件 (comp.ux) -->
<script>
export default {
  // 1. 声明 props
  props: ['say', 'propObject'],
  onInit() {
    console.info(`父组件传来的数据:`, this.say, this.propObject);
  }
}
</script>

<!-- 父组件 (page.ux) -->
<import name="my-comp" src="./comp.ux"></import>
<template>
  <div>
    <!-- 2. 绑定并传递数据 -->
    <my-comp say="{{greeting}}" prop-object="{{userInfo}}"></my-comp>
  </div>
</template>
<script>
export default {
  private: {
    greeting: '你好',
    userInfo: { name: '张三' }
  }
}
</script>
```

### 子组件 -> 父组件

子组件向父组件通信（传递数据或通知事件）主要有以下几种方式：

1. **`$emit` (推荐)** : 子组件触发一个在组件标签上绑定的自定义事件。
2. **`$dispatch`** : 子组件派发一个事件，沿着父链向上传播，任何父组件都可以通过 `$on` 监听到。
3. **修改引用对象 (不推荐)** : 如果父组件传递的是一个对象，子组件直接修改该对象的属性。这种方式会造成父子组件数据耦合，难以维护。

**事件通信对比**

| 方法                                              | 描述                                          | 使用场景                                                          |
| :------------------------------------------------ | :-------------------------------------------- | :---------------------------------------------------------------- |
| **`this.$emit('eventName', detail)`**     | 触发在组件标签上用 `on`或 `@`绑定的事件。 | **点对点通信** 。最常用，明确子组件和直接父组件的通信关系。 |
| **`this.$dispatch('eventName', detail)`** | 向上派发事件，所有祖先组件都能监听到。        | **广播式通信** 。当子组件需要通知多个层级的祖先组件时使用。 |

**示例 (`$emit`)**

```xml
<!-- 子组件 (comp1.ux) -->
<template>
  <div>
    <input type="button" value="通知父组件+1" onclick="addHandler"></input>
  </div>
</template>
<script>
export default {
  props: ['count'],
  addHandler() {
    const newCount = this.count + 1;
    // 触发在父组件标签上绑定的 'emit-evt' 事件
    this.$emit('emit-evt', { count: newCount });
  }
}
</script>

<!-- 父组件 (page.ux) -->
<import name="comp1" src="./comp1.ux"></import>
<template>
  <div>
    <text>父组件的 count: {{count}}</text>
    <!-- 监听子组件的 emit-evt 事件 -->
    <comp1 count="{{count}}" onemit-evt="handleChildEmit"></comp1>
  </div>
</template>
<script>
export default {
  private: { count: 20 },
  handleChildEmit(evt) {
    this.count = evt.detail.count;
  }
}
</script>
```

### 向下广播事件 (`$broadcast`)

父组件可以通过 `$broadcast('eventName', detail)` 向其所有后代组件（子、孙...）广播事件，后代组件通过 `$on('eventName', ...)` 监听。

---

## 4. 兄弟或跨级组件通信

对于没有直接父子关系的组件（如兄弟组件），通信需要借助一个公共的“事件总线”(Event Bus)。

#### 方案一：实现一个 Pub/Sub 模型 (推荐)

创建一个全局的发布/订阅服务，任何组件都可以订阅或发布事件，从而实现解耦的组件间通信。

1. **创建 `pubsub.js` 文件** : 实现一个包含 `subscribe`, `publish`, `remove` 方法的 `Pubsub` 类。
2. **在 `app.ux` 中实例化** : 在 `app.ux` 的 `onCreate` 中创建一个全局实例，挂载到 `this` 上。
3. **在任意组件中使用** :

* **发布** : `this.$root.pubsub.publish('eventName', data)`
* **订阅** : `this.$root.pubsub.subscribe('eventName', handler)`

#### 方案二：通过共同的父组件中转

对于兄弟组件，也可以通过 **“子组件A -> 父组件 -> 子组件B”** 的方式进行数据传递。

1. 子组件 A 通过 `$emit` 或 `$dispatch` 通知父组件。
2. 父组件监听到事件后，更新自己的数据。
3. 由于子组件 B 的 `props` 绑定了父组件的数据，当父组件数据更新时，子组件 B 会自动接收到最新的数据。
