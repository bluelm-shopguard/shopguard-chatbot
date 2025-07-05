# CORS 代理服务器使用指南

## 背景

当前端应用（如运行在 `http://localhost:8080` 或 `http://127.0.0.1:8080`）尝试向后端 API（运行在 `http://localhost:8000`）发送请求时，浏览器的同源策略会阻止跨域请求，导致 CORS 错误：

```text
Access to fetch at 'http://localhost:8000/v1/chat/completions' from origin 'http://127.0.0.1:8080' 
has been blocked by CORS policy: Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## 解决方案

我们创建了一个简单的代理服务器，它在同一个源上提供前端资源，并将 API 请求转发到后端，同时添加必要的 CORS 头信息。

## 使用方法

### 1. 准备工作

确保已安装所有依赖项：

```bash
npm install
```

### 2. 运行后端服务

确保您的后端 API 服务器正在运行，默认地址为：`http://localhost:8000`

### 3. 启动代理服务器

```bash
node server.js
```

成功启动后，您将看到如下输出：

```text
Server running at http://localhost:8080
API requests will be proxied to http://localhost:8000
```

### 4. 访问应用

在浏览器中访问：

```text
http://localhost:8080/src/homepage.html
```

## 技术原理

1. 代理服务器使用 Express.js 和 http-proxy-middleware 包创建
2. 所有对 `/v1/*` 路径的请求都会被转发到后端服务器
3. 自动添加 CORS 头，允许前端应用访问 API
4. 静态文件（HTML、CSS、JS等）由同一服务器提供

## 常见问题

### 如何修改代理目标地址？

如需修改后端 API 的地址，请编辑 `server.js` 文件中的 `target` 参数：

```javascript
app.use('/v1', createProxyMiddleware({
  target: 'http://your-new-backend-url:port',
  // 其他设置...
}));
```

### 如何解决端口冲突？

如果端口 8080 已被占用，可以修改 `server.js` 文件中的 `PORT` 变量：

```javascript
const PORT = 3000; // 或其他可用端口
```

然后相应地更新 `src/data/system-settings.js` 中的 API 端点：

```javascript
endpoint: "http://localhost:3000/v1/chat/completions",
```

## 注意事项

- 此代理解决方案仅适用于开发环境
- 在生产环境中，应由后端服务器正确设置 CORS 头信息
