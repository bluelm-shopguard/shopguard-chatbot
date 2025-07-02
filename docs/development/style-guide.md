# 样式指南

本指南定义了 ShopGuard AI 聊天机器人的视觉风格、设计原则和 CSS/样式使用规范，确保在网页版和快应用版中保持一致的用户体验。

## 设计系统

### 颜色系统

#### 主题色

| 变量名 | 亮色模式 | 暗色模式 | 用途 |
|-------|---------|---------|------|
| `--primary-color` | #10a37f | #1fd8a8 | 主按钮、重点元素 |
| `--primary-hover` | #0d8f6b | #19bd94 | 交互状态 |
| `--primary-light` | #e6f7f3 | #0d3d30 | 背景强调 |
| `--secondary-color` | #6366f1 | #818cf8 | 次要按钮、链接 |
| `--background-color` | #f3f4f6 | #111827 | 页面背景 |
| `--surface-color` | #ffffff | #1f2937 | 卡片、对话框背景 |
| `--text-primary` | #111827 | #f9fafb | 主要文本 |
| `--text-secondary` | #4b5563 | #9ca3af | 次要文本 |
| `--border-color` | #e5e7eb | #374151 | 边框、分割线 |

#### 灰度色阶

| 变量名 | 亮色模式 | 暗色模式 |
|-------|---------|---------|
| `--gray-50` | #f9fafb | #030712 |
| `--gray-100` | #f3f4f6 | #111827 |
| `--gray-200` | #e5e7eb | #1f2937 |
| `--gray-300` | #d1d5db | #374151 |
| `--gray-400` | #9ca3af | #4b5563 |
| `--gray-500` | #6b7280 | #6b7280 |
| `--gray-600` | #4b5563 | #9ca3af |
| `--gray-700` | #374151 | #d1d5db |
| `--gray-800` | #1f2937 | #e5e7eb |
| `--gray-900` | #111827 | #f3f4f6 |

#### 功能色

| 变量名 | 值 | 用途 |
|-------|-----|------|
| `--success-color` | #10b981 | 成功状态 |
| `--warning-color` | #f59e0b | 警告状态 |
| `--error-color` | #ef4444 | 错误状态 |
| `--info-color` | #3b82f6 | 提示状态 |

### 间距系统

基于 4px 的间距系统，确保界面元素间距的一致性。

| 变量名 | 值 | 用途 |
|-------|-----|------|
| `--space-1` | 4px | 最小间距 |
| `--space-2` | 8px | 紧凑元素间距 |
| `--space-3` | 12px | 相关元素间距 |
| `--space-4` | 16px | 标准间距 |
| `--space-5` | 20px | 组间距 |
| `--space-6` | 24px | 区块间距 |
| `--space-8` | 32px | 区域间距 |
| `--space-10` | 40px | 大区域间距 |
| `--space-12` | 48px | 最大间距 |

### 字体系统

#### 字体族

```css
--font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
--font-family-mono: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
```

#### 字体大小

| 变量名 | 值 | 用途 |
|-------|-----|------|
| `--font-size-xs` | 12px | 辅助文本、标签 |
| `--font-size-sm` | 14px | 次要文本 |
| `--font-size-base` | 16px | 正文文本 |
| `--font-size-lg` | 18px | 突出文本 |
| `--font-size-xl` | 20px | 小标题 |
| `--font-size-2xl` | 24px | 主标题 |
| `--font-size-3xl` | 30px | 大标题 |

#### 字体粗细

| 变量名 | 值 | 用途 |
|-------|-----|------|
| `--font-weight-normal` | 400 | 正常文本 |
| `--font-weight-medium` | 500 | 中等强调 |
| `--font-weight-semibold` | 600 | 次级标题 |
| `--font-weight-bold` | 700 | 标题、强调 |

### 圆角系统

| 变量名 | 值 | 用途 |
|-------|-----|------|
| `--radius-sm` | 4px | 小元素（按钮、输入框） |
| `--radius-md` | 8px | 卡片、对话框 |
| `--radius-lg` | 12px | 大型卡片 |
| `--radius-full` | 9999px | 圆形或胶囊形状 |

### 阴影系统

| 变量名 | 值 | 用途 |
|-------|-----|------|
| `--shadow-sm` | 0 1px 2px 0 rgba(0,0,0,0.05) | 轻微提升 |
| `--shadow-md` | 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06) | 中度提升 |
| `--shadow-lg` | 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05) | 强烈提升 |
| `--shadow-xl` | 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04) | 浮动元素 |

## CSS 命名规范

ShopGuard AI 采用 BEM (Block, Element, Modifier) 命名方法论，确保样式的可维护性和可扩展性。

### 命名结构

- **Block**: 独立实体，如 `.chat-message`
- **Element**: Block 的一部分，如 `.chat-message__content`
- **Modifier**: Block 或 Element 的变体，如 `.chat-message--user`

### 示例

```css
/* Block */
.chat-message {
  margin-bottom: var(--space-3);
}

/* Element */
.chat-message__content {
  padding: var(--space-3);
  border-radius: var(--radius-md);
}

/* Modifier */
.chat-message--user .chat-message__content {
  background-color: var(--primary-light);
}
```

### 避免的做法

- 避免深度嵌套选择器
- 避免直接使用元素选择器 (div, span 等)
- 避免使用 ID 选择器
- 避免使用 !important

## 布局系统

### 基于网格的布局

网页版使用 CSS Grid 和 Flexbox 进行灵活布局：

```css
.chat-app {
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100vh;
}
```

### 快应用布局转换

由于快应用只支持 Flex 布局，网页版的 Grid 布局需要转换为嵌套的 Flex 布局：

```css
/* 快应用布局 */
.chat-app {
  flex-direction: column;
  flex: 1;
}
```

## 响应式设计

### 断点系统

| 断点名称 | 宽度范围 | 设备类型 |
|---------|---------|---------|
| `xs` | <576px | 小型手机 |
| `sm` | 576px-767px | 手机 |
| `md` | 768px-991px | 平板竖屏 |
| `lg` | 992px-1199px | 平板横屏、小桌面 |
| `xl` | ≥1200px | 大桌面 |

### 媒体查询示例

```css
/* 基础样式（移动优先） */
.chat-input-area {
  padding: var(--space-3);
}

/* 平板及以上 */
@media (min-width: 768px) {
  .chat-input-area {
    padding: var(--space-4);
  }
}

/* 桌面 */
@media (min-width: 992px) {
  .chat-input-area {
    padding: var(--space-5);
  }
}
```

### 快应用适配

快应用使用不同的方式处理屏幕适配：

- 使用 `fp` (一般为屏幕宽度的 1/100) 作为相对单位
- 结合 `@media` 查询根据屏幕尺寸调整布局

## 动效系统

### 过渡时间

| 变量名 | 值 | 用途 |
|-------|-----|------|
| `--transition-fast` | 100ms | 小元素、即时反馈 |
| `--transition-normal` | 200ms | 标准元素 |
| `--transition-slow` | 300ms | 大元素、强调动效 |

### 缓动函数

| 变量名 | 值 | 用途 |
|-------|-----|------|
| `--ease-in-out` | cubic-bezier(0.4, 0, 0.2, 1) | 自然过渡 |
| `--ease-out` | cubic-bezier(0, 0, 0.2, 1) | 进入动效 |
| `--ease-in` | cubic-bezier(0.4, 0, 1, 1) | 离开动效 |

### 示例使用

```css
.sidebar {
  transform: translateX(-100%);
  transition: transform var(--transition-normal) var(--ease-out);
}

.sidebar.active {
  transform: translateX(0);
}
```

## CSS-to-Quick-App 转换指南

将 CSS 样式转换到快应用时的注意事项：

1. **单位转换**：
   - CSS: `px`, `em`, `rem`, `%`
   - 快应用: `px`, `%`, `vp`（视窗百分比）

2. **布局转换**：
   - CSS: `display: flex` 或 `display: grid`
   - 快应用: 仅支持 Flex 布局，默认启用

3. **样式属性名**：
   - CSS: 使用连字符 `background-color`
   - 快应用: 使用驼峰 `backgroundColor`

4. **不支持的属性替代**：

   | CSS 属性 | 快应用替代方案 |
   |---------|--------------|
   | `::before`, `::after` | 使用额外组件 |
   | CSS 动画 | 使用 `animation` 组件 |
   | 媒体查询 | 使用 JS 条件渲染 |

## 图标系统

ShopGuard AI 使用 [Lucide](https://lucide.dev/) 图标库，确保在移植到快应用时有适当替代方案。

### 网页版图标使用

```html
<i data-lucide="message-circle"></i>
<script>lucide.createIcons();</script>
```

### 快应用图标使用

```html
<image src="/common/images/icons/message-circle.png" class="icon-md"></image>
```

## 可访问性指南

遵循 WCAG 2.1 AA 级标准，确保应用对所有用户可用：

1. **颜色对比度**：文本与背景的对比度至少 4.5:1
2. **键盘导航**：所有功能可通过键盘访问
3. **屏幕阅读器支持**：使用适当的 ARIA 属性
4. **触摸目标尺寸**：至少 44x44 像素

## 性能优化

### CSS 性能最佳实践

1. **选择器优化**：避免过度具体的选择器
2. **避免重排和重绘**：优先修改不触发布局计算的属性
3. **分离关键 CSS**：首屏渲染所需的样式内联在头部
4. **延迟加载非关键样式**：使用 media 属性或 JS 延迟加载

### 快应用样式优化

1. **复用组件样式**：通过引用复用常用样式
2. **避免过度嵌套**：扁平化样式结构
3. **使用原生组件**：优先使用平台提供的组件
4. **避免频繁样式更新**：批量处理样式变更

## 样式调试技巧

1. **边框调试法**：使用彩色边框可视化布局
   ```css
   * { border: 1px solid red !important; }
   ```

2. **背景调试法**：使用不同背景色区分组件
   ```css
   .component { background-color: rgba(255,0,0,0.1) !important; }
   ```

3. **使用 Flex 调试工具**：为快应用布局问题排障

4. **模拟各种设备尺寸**：使用开发工具的设备模拟器
