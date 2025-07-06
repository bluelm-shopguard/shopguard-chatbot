
# WebSocket 教程

通过本节，你将学会如何使用 `system.websocketfactory` 来实现实时双向通信：

-   创建 WebSocket 连接
-   向服务器发送数据
-   接收服务器发送的消息
-   监听连接状态 (打开、关闭、错误)
-   关闭 WebSocket 连接

---

## 使用方法

### 1. 导入模块
在使用前，需要先导入 `@system.websocketfactory` 模块。

```javascript
import websocketfactory from '@system.websocketfactory'
```

### 2. 创建连接
使用 `websocketfactory.create(OBJECT)` 来创建一个 WebSocket 连接对象。这个调用会自动尝试与服务器建立连接。

```javascript
const ws = websocketfactory.create({
  url: 'wss://echo.websocket.org',
  header: {
    'content-type': 'application/json'
  },
  protocols: ['protocol'] // 可选的子协议
})
```

**参数说明：**

| 参数名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `url` | `String` | **必需**。要连接的 WebSocket 服务器 URL (应以 `ws://` 或 `wss://` 开头)。 |
| `header` | `Object` | 可选。附加的 HTTP 请求头。 |
| `protocols`| `Array<String>` | 可选。一个或多个子协议字符串。 |

---

### 3. 监听事件
WebSocket 的通信是基于事件的。你需要为创建的 `ws` 对象设置相应的事件监听函数来处理不同的连接状态。

#### 监听连接打开 (`onopen`)
当与服务器的连接成功建立时触发。

```javascript
ws.onopen = function () {
  console.log('WebSocket connection opened.');
  // 可以在这里进行初次的数据发送等操作
};
```

#### 接收服务器消息 (`onmessage`)
当从服务器接收到消息时触发。

```javascript
ws.onmessage = function (event) {
  // event.data 包含了服务器发送的数据
  console.log(`Received message: ${event.data}`);
};
```

#### 监听错误 (`onerror`)
当连接发生错误时触发。

```javascript
ws.onerror = function (event) {
  console.log('A WebSocket error occurred.');
};
```

#### 监听连接关闭 (`onclose`)
当连接被关闭时触发，无论是主动关闭还是被动断开。

```javascript
ws.onclose = function (event) {
  // event.code: 关闭状态码
  // event.reason: 关闭原因
  // event.wasClean: 是否是干净的关闭
  console.log(`Connection closed. Code: ${event.code}, Reason: ${event.reason}`);
};
```

---

### 4. 向服务器发送数据
连接打开后，使用 `ws.send(OBJECT)` 方法向服务器发送数据。

```javascript
ws.send({
  data: 'Hello, WebSocket!',
  success: function() {
    console.log('Message sent successfully.');
  },
  fail: function() {
    console.log('Failed to send message.');
  }
});
```
**`data` 参数**：可以是字符串或 ArrayBuffer。

---

### 5. 关闭连接
当你不再需要连接时，调用 `ws.close(OBJECT)` 方法来主动关闭它。

```javascript
ws.close({
  code: 1000, // W3C 标准定义的正常关闭状态码
  reason: 'Client closed the connection.',
  success: function() {
    console.log('Connection closed successfully.');
  },
  fail: function() {
    console.log('Failed to close the connection.');
  }
});
```

**参数说明：**

| 参数名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `code` | `Number` | 可选。一个数字状态码，表示关闭连接的原因。默认为 `1000`。 |
| `reason` | `String` | 可选。一个可读的字符串，解释连接被关闭的原因。 |

---

## 完整示例代码

这是一个完整的页面示例，演示了如何创建、发送、接收和关闭 WebSocket 连接。

```xml
<template>
  <div class="doc-page">
    <div class="item-container">
      <input type="button" class="btn" value="创建并连接" onclick="create" />
      <input type="text" class="input-text" placeholder="请输入要发送的消息" onchange="handleChange" />
      <input type="button" class="btn" value="发送消息" onclick="send" />
      <input type="button" class="btn" value="关闭连接" onclick="close" />
    </div>
  </div>
</template>

<script>
  import prompt from '@system.prompt';
  import websocketfactory from '@system.websocketfactory';

  let ws = null;
  let isConnected = false;

  export default {
    private: {
      message: ''
    },
    // 创建 WebSocket 实例并设置监听器
    create() {
      if (ws) return; // 防止重复创建

      ws = websocketfactory.create({
        url: 'wss://echo.websocket.org', // 一个公共的 WebSocket 测试服务
        header: {
          'content-type': 'application/json'
        },
        protocols: ['protocol']
      });

      // 监听连接打开事件
      ws.onopen = function () {
        isConnected = true;
        prompt.showToast({ message: '连接成功' });
      };

      // 监听消息事件
      ws.onmessage = function (data) {
        prompt.showToast({ message: `收到消息: ${data.data}` });
      };

      // 监听错误事件
      ws.onerror = function () {
        prompt.showToast({ message: '连接出错' });
      };

      // 监听关闭连接事件
      ws.onclose = function (data) {
        isConnected = false;
        ws = null; // 清理实例
        prompt.showToast({
          message: `连接已关闭: Code=${data.code}, Reason=${data.reason}`
        });
      };
    },
    handleChange(e) {
      this.message = e.value;
    },
    // 发送消息
    send() {
      if (!isConnected) {
        prompt.showToast({ message: '请先建立连接' });
        return;
      }
      ws.send({
        data: this.message,
        success: function () {
          prompt.showToast({ message: '发送成功' });
        },
        fail: function () {
          prompt.showToast({ message: '发送失败' });
        }
      });
    },
    // 关闭连接
    close() {
      if (!isConnected) {
        prompt.showToast({ message: '连接尚未建立或已关闭' });
        return;
      }
      ws.close({
        code: 1000,
        reason: '用户主动关闭',
        success: function () {
          prompt.showToast({ message: '关闭指令发送成功' });
        },
        fail: function () {
          prompt.showToast({ message: '关闭指令发送失败' });
        }
      });
    },
    onDestroy() {
      // 页面销毁时确保关闭连接
      if (ws && isConnected) {
        ws.close();
      }
    }
  }
</script>
```

## 多实例
WebSocket 支持创建多个实例。如果需要同时连接到多个 WebSocket 服务，只需多次调用 `websocketfactory.create()` 方法，并自行管理返回的 WebSocket 对象即可。
