
# 列表渲染 (`for` 指令)

在快应用中，如果你需要根据一个数组来渲染一个列表，可以使用 `for` 指令。`for` 指令会遍历一个数组，并为数组中的每个元素生成相应的 DOM 结构。

---

## 基础用法

`for` 指令支持多种写法来满足不同的需求。它作用于需要重复渲染的组件上。

#### 1. 默认变量

最简单的用法，框架会提供默认的变量名：
-   `$item`: 代表数组中的当前元素。
-   `$idx`: 代表当前元素的索引。

```xml
<div for="{{list}}">
  <text>索引 {{$idx}}: {{$item.name}}</text>
</div>
```

#### 2. 自定义元素变量名

你可以为数组元素指定一个更具语义的变量名。`$idx` 仍然代表索引。

```xml
<div for="value in list">
  <text>索引 {{$idx}}: {{value.name}}</text>
</div>
```

> **1100+ 新特性**：`list` 也可以是一个常量数字，用于循环固定次数。
> ```xml
> <div for="i in 10">
>   <text>这是第 {{i}} 个</text>
> </div>
> ```

#### 3. 自定义索引和元素变量名

你可以同时自定义索引和元素的变量名，这也是最灵活和推荐的写法。

```xml
<div for="(personIndex, personItem) in list">
  <text>索引 {{personIndex}}: {{personItem.name}}</text>
</div>
```

---

## `tid` 属性 (性能优化)

`tid` 属性用于为循环中的每个节点指定一个唯一的标识符 (key)。它的作用类似于 Vue 中的 `:key` 或 React 中的 `key`。

当列表数据更新时，框架会使用 `tid` 来识别哪些元素是新增的、删除的或仅仅是移动了位置，从而进行高效的 DOM 更新，避免不必要的重绘，优化渲染性能。

-   **用法**: `tid="uniqueId"`，其中 `uniqueId` 是数组元素对象中一个**具有唯一性**的属性名。
-   **默认值**: 如果不指定 `tid`，框架会默认使用数组索引 `$idx` 作为 key。在列表不会进行删除、插入或重排序操作时，这是一个可接受的默认行为。但在有动态变化的列表中，强烈建议总是指定一个稳定的 `tid`。

---

## 完整示例

```xml
<template>
  <div class="tutorial-page">
    <!-- 方式1：默认变量 -->
    <div class="tutorial-row" for="{{list}}" tid="uniqueId">
      <text>{{$idx}}. {{$item.name}}</text>
    </div>

    <!-- 方式2：自定义元素变量名 -->
    <div class="tutorial-row" for="value in list" tid="uniqueId">
      <text>{{$idx}}. {{value.name}}</text>
    </div>

    <!-- 方式3：自定义索引和元素的变量名 (推荐) -->
    <div class="tutorial-row" for="(personIndex, personItem) in list" tid="uniqueId">
      <text>{{personIndex}}. {{personItem.name}}</text>
    </div>
  </div>
</template>

<style>
  .tutorial-page {
    flex-direction: column;
    align-items: center;
  }
  .tutorial-row {
    width: 85%;
    margin-top: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
  }
</style>

<script>
  export default {
    private: {
      list: [
        { name: 'aa', uniqueId: 101 },
        { name: 'bb', uniqueId: 102 },
        { name: 'cc', uniqueId: 103 }
      ]
    },
    onInit () {
      this.$page.setTitleBar({ text: 'for 指令示例' });
    }
  }
</script>
```

---

## 注意事项

1.  **数据类型**: `for` 指令只能循环**数组**，不能直接循环对象。
2.  **与 `if` 的优先级**: 当 `for` 和 `if` 指令用在同一个标签上时，`if` 的优先级更高。这意味着 `if` 会先被判断，如果条件为假，整个 `for` 循环将不会执行。通常不建议将它们用在同一个标签上，可以考虑使用 `<block>` 标签来包裹。
3.  **`<block>` 标签**: 当 `for` 指令作用于 `<block>` 标签时，它只会循环渲染 `<block>` 内部的元素，而不会渲染 `<block>` 标签本身。这对于需要循环多个兄弟节点的场景非常有用。
4.  **变量命名**: 自定义索引和元素变量名时，名称不能以 `$` 或 `_` 开头。
5.  **`tid` 属性使用**:
    -   `tid` 指定的属性**必须**在数据项中存在。
    -   `tid` 指定的属性值在整个列表中**必须是唯一的**，否则可能导致渲染异常和性能问题。
    -   `tid` 属性目前不支持表达式，只能是数据对象中的一个属性名字符串。
