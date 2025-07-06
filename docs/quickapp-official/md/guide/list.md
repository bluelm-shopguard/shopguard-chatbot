
# 快应用 `list` 组件使用指南

本节将深入探讨如何正确使用 `list` 组件来构建高性能的长列表，实现流畅的滚动体验，并灵活实现如吸顶等复杂交互。

通过本节，你将学会：

-   `list` 组件的适用场景
-   关键的性能优化技巧
-   如何利用 `list` 实现吸顶效果

---

## 1. 适用场景

### 简单场景：`div` vs `list`

在实现长列表时，开发者可能习惯于使用 `div` 配合 `for` 指令进行循环渲染。

**使用 `div` 的问题**:
当列表项的 DOM 结构复杂或数量庞大时，使用 `div` 循环会一次性将所有 DOM 节点渲染到视图中。这会导致初始渲染时间过长，并且在滚动时由于 DOM 元素过多，容易出现卡顿，用户体验不佳。Native 底层无法复用 `div` 实现的列表元素。

**使用 `list` 的优势**:
为了解决这个问题，框架提供了专门的 `list` 组件。`list` 组件配合 `list-item` 子组件，能够实现**列表项的复用机制**。当列表滚动时，移出屏幕的 `list-item` 会被回收，并用于渲染即将进入屏幕的新列表项。这极大地减少了实际渲染的 DOM 数量，从而保证了长列表的滚动流畅度。

**性能优化的关键**:
`list` 组件的复用机制依赖于 `list-item` 的 `type` 属性。**Native 底层只会复用具有相同 `type` 值的 `list-item`**。因此，为结构相同的列表项设置统一的 `type` 是优化性能的核心。

**代码对比:**

**`div` 实现 (不推荐用于长列表):**
```xml
<div class="page-container">
  <block for="productList">
    <div class="product-item">
      <!-- ... item content ... -->
    </div>
  </block>
  <!-- ... load more ... -->
</div>
```

**`list` 实现 (推荐):**
```xml
<list class="page-container" onscrollbottom="loadMoreData">
  <!-- 商品列表 -->
  <block for="productList">
    <list-item type="product" class="product-item">
      <!-- ... item content ... -->
    </list-item>
  </block>

  <!-- 加载更多 -->
  <list-item type="loadMore" class="load-more">
    <progress type="circular"></progress>
    <text>加载更多</text>
  </list-item>
</list>
```

**重要注意事项**:
-   `list-item` 内**不能**再嵌套 `list` 组件。
-   `list-item` 的 `type` 属性是**必填项**。
-   相同 `type` 的 `list-item` 必须拥有**完全相同**的 DOM 结构。避免在内部使用 `if` 或 `for` 指令导致结构不一致。若必须使用，应通过动态 `type` 或拆分成不同 `type` 的 `list-item` 来解决。
-   若遇到 `...cannot be cast to...` 错误，请检查是否违反了以上规则。

### 复杂场景

当一个列表中包含多种不同布局的列表项时（如广告、不同样式的商品），只需为每种布局定义一个唯一的 `type` 即可。

**示例：左图右文 和 右图左文 交错的列表**

```xml
<list onscrollbottom="loadMoreData">
  <block for="{{productList}}">
    <!-- 类型一: 图片在左 -->
    <list-item type="productLeft" if="{{$idx % 2 === 0}}">
      <image src="{{$item.img}}"></image>
      <div>...text content...</div>
    </list-item>

    <!-- 类型二: 图片在右 -->
    <list-item type="productRight" if="{{$idx % 2 === 1}}">
      <div>...text content...</div>
      <image src="{{$item.img}}"></image>
    </list-item>
  </block>
  <list-item type="loadMore">...</list-item>
</list>
```

---

## 2. 性能优化

为了获得极致的滚动体验，请遵循以下优化原则：

1.  **精简 DOM 层级 (必须)**
    减少 `list-item` 内部的 DOM 节点数量和嵌套层级。层级越浅，布局和绘制就越快。

2.  **复用 `list-item` (必须)**
    为结构相同的列表项设置统一的 `type` 值，这是 `list` 性能优化的基石。

3.  **细粒度划分 `list-item` (推荐)**
    当一个业务模块（如一个商品分类）内部结构非常复杂时，不要把它整个作为一个 `list-item`。应将其**从视觉结构上**拆分成多个更小的、可复用的部分，每一部分都是一个独立的 `list-item`，并赋予不同的 `type`。例如，一个分类可以拆分为 "分类标题" (`type="title"`)、"Banner图" (`type="banner"`)、"商品网格" (`type="productGrid"`) 等。

4.  **关闭 `scrollpage` (推荐)**
    `list` 组件的 `scrollpage` 属性可以让页面中 `list` 之外的元素（如顶部的 Header）随列表一起滚动。但开启此属性会**降低性能**。
    **推荐做法**：不要开启 `scrollpage`，而是将 Header 部分也作为一个特殊 `type` 的 `list-item` 放入 `list` 的最上方。这样整个页面就是一个 `list`，性能最佳。

5.  **`list-item` 懒加载**
    这是一种数据层面的优化策略，用于改善首屏加载速度和滚动体验。
    -   **核心思想**：一次性从网络请求较多的数据（如 100 条）并缓存在内存中（一个普通 JS 数组，**不要**放在 ViewModel 的 `data/private` 中）。
    -   **渲染逻辑**：每次只从内存数组中取出少量数据（如 10 条）赋给页面绑定的数组进行渲染。
    -   **加载更多**: 滚动到底部时，继续从内存数组中取数据来渲染，而不是立即发起网络请求。当内存数据即将耗尽时，再提前发起下一次网络请求填充内存数组。
    -   **优点**: 将耗时的网络请求与快速的页面渲染解耦，用户滚动时几乎没有等待时间。

---

## 3. 效果展示：吸顶

吸顶效果是常见的列表交互。在快应用中，不推荐监听 `onscroll` 事件来实现（高频触发，有性能隐患），而是推荐利用 `onappear` 和 `ondisappear` 事件。

-   `onappear`: 组件进入屏幕可视区域时触发。
-   `ondisappear`: 组件完全离开屏幕可视区域时触发。

**实现思路**:
1.  **布局**: 使用 `<stack>` 组件作为根容器。`list` 组件作为第一层，一个用于模拟吸顶效果的 "Mask" `div` 作为第二层（会覆盖在 `list` 上方）。这个 Mask `div` 的内容和样式与需要吸顶的 `list-item` 完全一样，但它默认是隐藏的 (`show="{{false}}`)。
2.  **锚点元素**: 在 `list` 中，将需要吸顶的 `list-item` 上方的那个元素作为“锚点”。
3.  **逻辑**:
    -   监听**锚点元素**的 `ondisappear` 事件。当它消失时，说明列表已向上滚动到需要吸顶的位置，此时将 Mask `div` 显示出来 (`show="{{true}}`)。
    -   监听**锚点元素**的 `onappear` 事件。当它重新出现时，说明列表已向下滚动回原位，此时将 Mask `div` 隐藏 (`show="{{false}}`)。

**示例代码:**

```xml
<template>
  <stack class="page">
    <!-- 列表层 -->
    <list>
      <!-- 1. 锚点元素，监听它的出现和消失 -->
      <list-item type="top" ondisappear="showMask" onappear="hideMask">
        <div class="top-element">...</div>
      </list-item>

      <!-- 2. 实际的、会随列表滚动的吸顶元素 -->
      <list-item type="ceiling">
        <div class="ceiling-content">...</div>
      </list-item>
      
      <!-- ... other list items ... -->
    </list>

    <!-- 3. Mask 层，用于显示吸顶效果，默认隐藏 -->
    <div class="ceiling-content-mask" show="{{isMaskShow}}">
        <!-- 内容和样式与真实吸顶元素完全一样 -->
    </div>
  </stack>
</template>

<script>
export default {
  private: {
    isMaskShow: false
  },
  showMask() {
    this.isMaskShow = true;
  },
  hideMask() {
    this.isMaskShow = false;
  }
}
</script>
```
