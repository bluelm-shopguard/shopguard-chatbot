
# 快应用事件监听与触发

本节将介绍快应用中的事件监听 API，以及如何监听和触发 ViewModel 层面和原生组件节点的事件。

> **注意**：本节描述的均为**单个页面实例内**的事件通信。如需了解父子组件间的事件通信，请参考组件化开发的相关文档。

通过本节，你将学会：

-   监听与移除 ViewModel 事件：`$on()` 和 `$off()`
-   手动触发 ViewModel 事件：`$emit()`
-   监听原生组件事件 (如 `click`)
-   手动触发原生组件事件：`$emitElement()`
-   理解和使用事件冒泡

---

## 1. ViewModel 事件

ViewModel 事件是在页面的 `<script>` 逻辑层中，通过 API 进行监听和触发的自定义事件。它与视图（template）无关，用于实现逻辑解耦。

### `$on(eventName, handler)`: 监听事件

用于在当前页面实例上注册一个自定义事件的监听器。

```javascript
// <script>
export default {
  onInit() {
    // 监听一个名为 'customEvt' 的自定义事件
    this.$on('customEvt', this.customEventHandler);
  },
  customEventHandler(event) {
    // event 对象包含 type 和 detail 属性
    console.info(`事件触发：类型: ${event.type}, 参数: ${JSON.stringify(event.detail)}`);
    // 输出: 事件触发：类型: customEvt, 参数: {"someData":"Hello"}
  }
}
</script>
```

### `$emit(eventName, detail)`: 触发事件

用于触发当前页面实例上由 `$on` 注册的事件。

```javascript
// <script>
export default {
  // ... onInit 和 customEventHandler
  triggerMyEvent() {
    // 触发 'customEvt' 事件，并传递一个对象作为参数
    this.$emit('customEvt', { someData: 'Hello' });
  }
}
</script>
```

### `$off(eventName, handler)`: 移除监听

用于移除事件监听器，避免不必要的逻辑执行或内存泄漏。

-   `this.$off('customEvt', this.customEventHandler)`: 仅移除指定的 `customEventHandler` 函数。
-   `this.$off('customEvt')`: 移除 `customEvt` 事件的所有监听函数。

---

## 2. 原生组件事件

原生组件事件是指在 `<template>` 中，由用户交互（如点击）或组件状态改变而触发的事件。

### 监听原生组件事件

直接在组件标签上使用 `on` + `事件名` (如 `onclick`) 或 `@` + `事件名` (简写，如 `@click`) 来绑定事件处理函数。

在事件处理函数中，可以通过多种方式获取事件信息：

-   **通过事件对象 `event`**: 事件处理函数的最后一个参数总是事件对象 `event`，其 `event.target` 属性指向触发事件的组件节点。
-   **在绑定时传递参数**: 可以在绑定时直接传入自定义参数。

```xml
<template>
  <div>
    <!-- 方法1：通过 event.target 获取节点信息 -->
    <text id="elNode1" onclick="onClickHandler">组件节点1</text>

    <!-- 方法2：绑定时传递自定义参数 -->
    <text id="elNode2" onclick="onClickHandler2('自定义参数', argName)">组件节点2</text>
  </div>
</template>

<script>
export default {
  private: {
    argName: '动态参数'
  },
  onClickHandler(event) {
    console.info(`事件类型: ${event.type}`);
    // event.target 提供了对触发事件组件的访问
    if (event.target) {
      console.info(`触发节点ID: ${event.target.id}, class: ${event.target.className}`);
    }
  },
  onClickHandler2(arg1, arg2, event) {
    console.info(`自定义参数: ${arg1}, ${arg2}`);
    console.info(`事件类型: ${event.type}`);
  }
}
</script>
```

### `$emitElement(eventName, detail, id)`: 触发原生组件事件

除了用户手动操作，你也可以在代码中通过 `$emitElement()` 来手动触发一个指定 `id` 的原生组件的事件。

> **注意**：通过此方法触发的事件，其事件对象 `event` 中**不包含 `target` 属性**。如果需要传递节点信息，可以通过 `detail` 参数实现。

```javascript
// <script>
export default {
  // ... 其他方法
  triggerElementEvent() {
    // 手动触发 id 为 'elNode1' 的组件的 click 事件
    this.$emitElement('click', { params: '这是手动触发时传递的参数' }, 'elNode1');
  }
}
</script>
```

---

## 3. 事件冒泡 (1040+)

对于部分通用事件（如 `click`、`touchstart` 等），快应用支持事件冒泡机制。事件会从最内层的触发元素开始，逐级向上传播到父元素。

> **启用条件**：`manifest.json` 中 `minPlatformVersion` 必须设置为 `1040` 或以上。

-   `event.target`: 始终指向**最初触发事件**的那个节点（例如，子节点）。
-   `event.currentTarget`: 指向**当前正在处理事件**的节点（在冒泡过程中会变化）。

### 示例

```xml
<template>
  <!-- 父元素监听 click 事件 -->
  <div id="parentNode" onclick="onParentClickHandler">
    <!-- 子元素也监听 click 事件 -->
    <text id="childNode" onclick="onChildClickHandler">点击我</text>
  </div>
</template>

<script>
export default {
  onParentClickHandler(event) {
    console.log('父组件事件触发'); // 后执行
    console.log(`target: ${event.target.id}, currentTarget: ${event.currentTarget.id}`);
    // 输出: target: childNode, currentTarget: parentNode
  },
  onChildClickHandler(event) {
    console.log('子组件事件触发'); // 先执行
  }
}
</script>
```
点击文本后，会先打印 "子组件事件触发"，然后事件冒泡到父 `div`，再打印 "父组件事件触发"。

### `event.stopPropagation()`: 阻止事件冒泡

在事件处理函数中调用 `event.stopPropagation()` 可以阻止事件继续向上传播。

```javascript
// <script>
export default {
  onParentClickHandler(event) {
    // 这个函数将不会被执行
    console.log('父组件事件触发');
  },
  onChildClickHandler(event) {
    console.log('子组件事件触发');
    // 阻止事件继续冒泡到父元素
    event.stopPropagation();
  }
}
</script>
```
现在，点击文本后将只打印 "子组件事件触发"。
