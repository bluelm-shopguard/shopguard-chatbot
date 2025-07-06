
# 快应用自定义指令指南 (1100+)

在某些场景下，我们需要直接访问 DOM 元素，或在元素的创建、更新、销毁等生命周期中执行特定的业务逻辑。快应用的**自定义指令**机制为此提供了解决方案。

> **兼容性要求**：
> -   快应用引擎版本 ≥ **1100**
> -   hap-toolkit 版本 ≥ **1.9.5**

通过本节，你将学会：

-   定义全局、页面、组件级别的自定义指令
-   理解自定义指令的钩子函数及其回调参数
-   在组件上使用自定义指令
-   了解使用自定义指令时的注意事项

---

## 1. 定义自定义指令

快应用支持在全局 (`app.ux`)、页面 (`.ux`) 和组件 (`.ux`) 三个层级定义指令。指令具有继承和覆盖的特性：页面/组件会继承全局指令；如果页面/组件定义了与全局同名的指令，则会覆盖全局指令。

### 全局指令

在 `app.ux` 中通过 `directives` 对象定义的指令，在应用内的所有页面和组件中都可用。

**示例：定义一个全局的 `focus` 指令**

```javascript
// app.ux
export default {
  directives: {
    // 指令名称为 'focus'
    focus: {
      // 在元素挂载到父节点后调用
      mounted(el) {
        // el 是元素的 DOM 对象，可以直接调用其原生方法
        el.focus();
      }
    }
    // ...可以定义其他全局指令
  }
}
```

**使用全局指令**:
在模板中，通过 `dir:指令名` 的格式来使用。`dir:` 是固定前缀。

```xml
<template>
  <div>
    <!-- 页面加载后，此 input 元素将自动获得焦点 -->
    <input dir:focus></input>
  </div>
</template>
```

### 页面与组件指令

在页面或组件的 `.ux` 文件中定义指令的方式与全局定义完全相同，也是通过 `directives` 对象。这类指令的作用域仅限于当前页面或组件。

```xml
<!-- page.ux -->
<template>
  <div>
    <text dir:textmounted="{{ message }}">message: "{{ message }}"</text>
  </div>
</template>

<script>
export default {
  directives: {
    textmounted: {
      mounted(el, binding) {
        console.log('元素DOM对象:', el);
        console.log('指令绑定信息:', binding); // 输出: {name: "textmounted", data: "Hello"}
      }
    }
  },
  data: {
    message: 'Hello'
  }
}
</script>
```

---

## 2. 钩子函数与回调参数

自定义指令的定义对象可以提供三个可选的生命周期钩子函数。

### 钩子函数

| 钩子函数 | 说明 |
| :--- | :--- |
| **`mounted(el, binding)`** | 指令所在的元素**创建并插入父节点后**调用。 |
| **`update(el, binding)`** | 指令所在的元素**更新时**调用。每次更新（如属性、样式变化）都会触发。 |
| **`destroy()`** | 指令所在的元素**销毁后**调用。 |

### 回调参数

#### `mounted(el, binding)`

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| `el` | `DomElement` | 指令所在元素的 DOM 对象。 |
| `binding`| `Object` | 一个包含指令相关信息的对象。 |

`binding` 对象包含：
-   `name` (string): 指令名（会自动转为小写）。
-   `data` (any): 指令的绑定值，如 `dir:my-directive="{{ 1 + 1 }}"` 中，`data` 的值为 `2`。

#### `update(el, binding)`

`update` 钩子的 `binding` 对象除了包含 `name` 和 `data` 外，还额外提供了更新的详细信息：

| 属性 | 类型 | 说明 |
| :--- | :--- | :--- |
| `type` | string | 更新类型，值为 `attr` (属性) 或 `style` (样式)。 |
| `key` | string | 更新内容的键名，如属性名 `id` 或样式名 `fontSize`。 |
| `newValue`| any | 更新后的值。 |
| `oldValue`| any | 更新前的值。 |

**示例：**
当一个 `<text>` 元素的 `id`、`value`（文本内容）和 `font-size` 样式同时更新时，`update` 钩子会**触发三次**，每次的 `binding` 对象都会携带对应 `key` 的更新信息。

#### `destroy()`

此钩子在元素销毁后调用，因此**没有回调参数**。

---

## 3. 在组件上使用自定义指令

自定义指令可以像用在普通元素上一样，直接用在组件标签上。

```xml
<!-- 父组件 -->
<import name="sub-component" src="./sub-component.ux"></import>
<template>
  <div>
    <!-- 在自定义组件上使用 report 指令 -->
    <sub-component dir:report="{{ pageName }}"></sub-component>
  </div>
</template>
<script>
export default {
  directives: {
    report: {
      mounted(el, binding) {
        // el 将是 sub-component 组件的根元素 DOM 对象
      }
    }
  },
  data: { pageName: '父页面' }
}
</script>
```

---

## 4. 注意事项

**避免在父子组件间使用同名指令**

一个关键的限制是：当在父组件的模板中为一个子组件标签使用指令时，该子组件的根元素上**不应该**再使用一个在子组件内部定义的、与父组件指令**同名**的指令。

**错误示例：**

```xml
<!-- 父组件 -->
<template>
  <!-- 父组件使用了自己的 'report' 指令 -->
  <sub-component dir:report="{{ data }}"></sub-component>
</template>
<script>
export default {
  directives: { report: { /* ... */ } }
}
</script>

<!-- 子组件 -->
<template>
  <!-- 子组件的根元素使用了自己的 'report' 指令 -->
  <div dir:report="{{ data }}">...</div>
</template>
<script>
export default {
  directives: { report: { /* ... */ } }
}
</script>
```

**原因**：父组件中施加在 `<sub-component>` 标签上的指令，最终会作用于子组件的根元素 (`<div>`)。如果子组件根元素本身也使用了同名指令，框架将无法区分该执行哪个指令的逻辑，导致行为未定义。

**解决方案**：确保这种场景下的指令名称是唯一的。
