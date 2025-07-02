# 组件库

ShopGuard AI 聊天机器人使用了模块化组件架构，这些组件可以在网页版和快应用版中重用（经过适当调整）。本文档详细介绍了各个组件的设计、功能和用法。

## 核心组件

### 聊天界面 (ChatInterface)

聊天界面是应用的主体部分，负责显示聊天消息和用户输入区域。

#### 结构

```
ChatInterface
├── ChatHeader       # 顶部标题栏
├── ChatContent      # 消息显示区域
│   ├── WelcomeView  # 首次使用欢迎界面
│   └── MessageList  # 消息列表
└── ChatInputArea    # 底部输入区域
    ├── Toolbar      # 工具栏（图片上传等）
    ├── InputField   # 文本输入框
    └── SendButton   # 发送按钮
```

#### 属性

| 属性名 | 类型 | 描述 |
| ----- | ---- | ---- |
| messages | Array | 消息历史记录 |
| loading | Boolean | 是否正在加载回复 |
| currentImageData | String | 当前选择的图片数据（Base64） |

#### 方法

| 方法名 | 参数 | 描述 |
| ----- | ---- | ---- |
| sendMessage | - | 发送当前输入的消息 |
| appendMessage | (sender, text, imageData) | 添加新消息到聊天记录 |
| clearChat | - | 清除当前聊天记录 |
| uploadImage | (event) | 处理图片上传 |

#### 使用示例

```javascript
// 添加用户消息
chatInterface.appendMessage('user', '这个商品靠谱吗？', imageDataUrl);

// 添加机器人回复
chatInterface.appendMessage('bot', '根据图片分析，该商品诈骗风险评级为★☆☆☆☆（低风险）...');
```

### 侧边栏 (Sidebar)

侧边栏组件用于显示聊天历史记录和用户信息。

#### 结构

```
Sidebar
├── SidebarHeader   # 标题和关闭按钮
├── ConversationList # 历史对话列表
└── UserInfo        # 用户信息和设置按钮
```

#### 属性

| 属性名 | 类型 | 描述 |
| ----- | ---- | ---- |
| active | Boolean | 侧边栏是否可见 |
| conversations | Array | 历史对话列表 |
| currentUser | Object | 当前用户信息 |

#### 方法

| 方法名 | 参数 | 描述 |
| ----- | ---- | ---- |
| toggleSidebar | - | 切换侧边栏显示状态 |
| selectConversation | (id) | 选择并加载特定对话 |
| deleteConversation | (id) | 删除特定对话 |

#### 使用示例

```javascript
// 打开侧边栏
sidebar.toggleSidebar(true);

// 选择特定对话
sidebar.selectConversation('conversation-123');
```

## 辅助组件

### 消息气泡 (MessageBubble)

用于显示单条聊天消息的组件。

#### 属性

| 属性名 | 类型 | 描述 |
| ----- | ---- | ---- |
| sender | String | 发送者类型（'user'/'bot'） |
| content | String | 消息文本内容 |
| timestamp | Date | 发送时间戳 |
| imageUrl | String | 可选，包含的图片URL |

#### 渲染示例

```html
<!-- 用户消息 -->
<div class="chat-message chat-message--user">
  <div class="chat-message__image">
    <img src="data:image/jpeg;base64,..." alt="Uploaded image">
  </div>
  <div class="chat-message__content">这个商品靠谱吗？</div>
</div>

<!-- 机器人消息 -->
<div class="chat-message chat-message--bot">
  <div class="chat-message__content">
    根据图片分析，该商品诈骗风险评级为★☆☆☆☆（低风险）...
  </div>
</div>
```

### 图片预览 (ImagePreview)

显示用户上传的图片预览。

#### 属性

| 属性名 | 类型 | 描述 |
| ----- | ---- | ---- |
| imageUrl | String | 图片URL或Base64数据 |
| visible | Boolean | 是否可见 |

#### 方法

| 方法名 | 参数 | 描述 |
| ----- | ---- | ---- |
| removeImage | - | 移除当前图片 |

## 状态管理

组件之间的状态管理采用了发布-订阅模式，允许组件之间进行解耦通信。

### 事件类型

| 事件名 | 数据 | 描述 |
| ----- | ---- | ---- |
| message:send | {text, image} | 发送新消息 |
| message:received | {text, sender} | 接收到新消息 |
| sidebar:toggle | {visible} | 侧边栏状态变化 |
| theme:change | {theme} | 主题变更 |

### 示例用法

```javascript
// 发布事件
eventBus.emit('message:send', {
  text: '这个商品靠谱吗？',
  image: imageDataUrl
});

// 订阅事件
eventBus.on('message:received', (data) => {
  appendMessage(data.sender, data.text);
});
```

## 组件适配

从网页版迁移到快应用时，需要对组件进行适配。以下是主要差异和适配方法：

### 网页版与快应用组件对应关系

| 网页版 | 快应用 |
| ----- | ------ |
| `<div>` | `<div>` |
| `<button>` | `<input type="button">` |
| `<input>` | `<input>` |
| `<img>` | `<image>` |
| `<h1>`, `<h2>`, `<p>` | `<text>` |

### 事件处理差异

| 网页版 | 快应用 |
| ----- | ------ |
| `addEventListener('click', handler)` | `onclick="handler"` |
| `e.preventDefault()` | 不适用 |
| `e.stopPropagation()` | 不适用 |

## 样式转换

从 CSS 转换为快应用样式时的主要注意点：

1. 快应用只支持 Flex 布局
2. 所有尺寸必须明确单位（px、%、vp等）
3. 不支持继承和级联样式
4. 样式名使用驼峰式命名法

## 组件设计最佳实践

1. **保持组件单一职责**：每个组件应专注于一个功能点
2. **组件接口清晰**：明确定义输入属性和输出事件
3. **共享状态最小化**：尽量减少组件间共享状态
4. **样式封装**：组件样式应自包含，避免外部依赖
5. **错误边界处理**：为每个组件添加适当的错误处理
6. **可访问性考虑**：组件设计应符合可访问性标准
