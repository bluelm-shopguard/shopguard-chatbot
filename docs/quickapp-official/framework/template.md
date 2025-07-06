
# 快应用 Template 模板语法指南

`<template>` 部分负责定义页面的结构，它使用一种类似 HTML 的标签语言，通过组合基础组件、自定义组件和事件来构建用户界面。

> **核心规则**：`<template>` 内部必须有且仅有一个根节点。不支持多个根节点，也不要使用 `<block>` 作为根节点。

---

## 1. 数据绑定

通过 `{{ }}` 语法（Mustache 语法）将 `<script>` 中定义的数据绑定到视图上。当数据变化时，视图会自动更新。

```xml
<template>
  <text>{{ message }}</text>
</template>

<script>
  export default {
    private: {
      message: 'Hello, World!'
    }
  }
</script>
```

---

## 2. 事件绑定

使用 `on` 或 `@` 前缀为组件绑定事件，当事件触发时，调用 `<script>` 中对应的方法。

```xml
<template>
  <div>
    <!-- 标准写法 -->
    <text onclick="updateMessage"></text>
    <!-- 缩写 -->
    <text @click="updateMessage"></text>
  </div>
</template>

<script>
  export default {
    updateMessage(e) {
      this.message = 'Updated Message';
      // 事件对象 e 会被自动追加到参数列表末尾
      console.log('Clicked at:', e.touch.clientX, e.touch.clientY);
    }
  }
</script>
```

**回调写法**:
-   `"methodName"`: 直接调用方法。
-   `"methodName(arg1, arg2)"`: 调用方法并传递参数，参数可以是常量或数据变量。
-   `"expression"`: 执行一个简单的表达式，如 `"count + 1"`。

---

## 3. 列表渲染 (for)

使用 `for` 指令可以根据一个数组来渲染一个列表。

```xml
<template>
  <div>
    <!-- 使用 tid 提升渲染性能 -->
    <div for="{{list}}" tid="uniqueId">
      <text>索引: {{$idx}}</text>
      <text>ID: {{$item.uniqueId}}</text>
    </div>
  </div>
</template>

<script>
  export default {
    private: {
      list: [
        { uniqueId: 'a1' },
        { uniqueId: 'a2' }
      ]
    }
  }
</script>
```

**`for` 指令的写法**:
-   `for="{{ array }}"`: 默认变量名为 `$item` (元素) 和 `$idx` (索引)。
-   `for="{{ value in array }}"`: 自定义元素名为 `value`。
-   `for="{{ (index, value) in array }}"`: 自定义索引名为 `index`，元素名为 `value`。

**`tid` 属性**:
-   用于指定列表中每个元素的**唯一标识符**，对应数组中每个对象的某个唯一属性。
-   框架使用 `tid` 来重用和重排元素，可以极大地优化列表渲染的性能。
-   **强烈建议**在 `for` 循环中总是使用 `tid`，并确保其值的唯一性。

---

## 4. 条件渲染 (if / show)

| 指令 | 描述 | 使用场景 |
|:--- |:---|:---|
| **`if`/`elif`/`else`** | 条件为 `false` 时，组件会从虚拟 DOM 中**彻底移除**。 | 适用于运行时条件不常改变的场景，有较高的切换开销。 |
| **`show`** | 条件为 `false` 时，组件仅仅是**不可见** (等同于 `display: none`)，但依然存在于 DOM 树中。 | 适用于需要频繁切换显示/隐藏状态的场景，有较高的初始渲染开销。 |

**`if`/`elif`/`else` 示例**:
*注：`if`/`elif`/`else` 节点必须是相邻的兄弟节点。*
```xml
<template>
  <div>
    <text if="{{type === 'A'}}">Type is A</text>
    <text elif="{{type === 'B'}}">Type is B</text>
    <text else>Other Type</text>
  </div>
</template>
```

**`show` 示例 (1050+)**:
```xml
<template>
  <text show="{{isVisible}}">This text might be hidden.</text>
</template>
```

---

## 5. 逻辑控制块 (`<block>`)

`<block>` 是一个不可见的逻辑包装元素，它不会被渲染到最终的 DOM 中。它通常用于将多个元素组合在一起，进行统一的 `for` 或 `if` 控制。

```xml
<template>
  <list>
    <!-- 使用 block 进行复杂的嵌套循环 -->
    <block for="{{cities}}">
      <list-item type="city">
        <text>{{$item.name}}</text>
      </list-item>
      <list-item type="spot" for="{{$item.spots}}">
        <text>{{$item.address}}</text>
      </list-item>
    </block>
  </list>
</template>
```

---

## 6. 自定义组件

### 引入和使用 (`<import>`)

使用 `<import>` 标签引入自定义组件，然后在 `<template>` 中像使用基础组件一样使用它。

```xml
<!-- 引入组件，并命名为 'my-comp' -->
<import name="my-comp" src="./components/MyComponent"></import>

<template>
  <div>
    <!-- 使用组件，并传递 props 和绑定事件 -->
    <my-comp prop1="some value" @customevent="handleEvent"></my-comp>
  </div>
</template>
```
-   **`name`**: 为组件指定一个标签名。如果省略，则默认使用文件名。
-   **`src`**: 指定组件 `.ux` 文件的路径（可省略 `.ux` 后缀）。
-   **事件名**: 推荐使用 `kebab-case` (短横线连接) 格式来声明事件绑定，如 `@event-type` 对应子组件的 `$emit('eventType')`。

### 全局自定义组件 (1090+)

在 `app.ux` 中引入的组件会成为全局组件，无需在每个页面中重复引入。

### 插入子节点 (`<slot>`)

在自定义组件的模板中使用 `<slot>` 标签，可以为该组件定义一个内容插入点。

**组件 `comp-a.ux`**:
```xml
<template>
  <div>
    <text>Header</text>
    <slot></slot> <!-- 子节点将插入到这里 -->
    <text>Footer</text>
  </div>
</template>
```

**页面中使用 `comp-a`**:
```xml
<import name="comp-a" src="./comp-a"></import>
<template>
  <comp-a>
    <!-- 这部分内容将被插入到 slot 的位置 -->
    <text>This is the body content.</text>
  </com-a>
</template>
```

---

## 7. 动态组件 (`<component>`) (1070+)

使用 `<component>` 标签和 `is` 属性，可以根据一个变量动态地决定要渲染哪个组件。

```xml
<import src="./part1.ux" name="part1"></import>
<import src="./part2.ux" name="part2"></import>

<template>
  <div>
    <!-- is 的值'part1'或'part2'，对应要渲染的组件名 -->
    <component is="{{componentName}}"></component>
  </div>
</template>
<script>
export default {
  private: {
    componentName: 'part1'
  },
  onReady(){
    setTimeout(() => {
      this.componentName = 'part2'; // 3秒后切换组件
    }, 3000);
  }
}
</script>
```

---

## 8. 过滤器 (Filters)

过滤器用于文本格式化，它是一个可以串联使用的函数。

```xml
<template>
  <!-- 使用管道符 | 调用过滤器 -->
  <text>{{ message | capitalize }}</text>
</template>

<script>
  export default {
    private: {
      message: 'hello'
    },
    // 在页面 <script> 中定义过滤器函数
    capitalize(value) {
      if (!value) return '';
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  }
</script>
```
-   **串联**: `{{ message | filterA | filterB }}`
-   **传参**: `{{ message | filterA('arg1', arg2) }}`