
# 数据请求 fetch

## 接口声明

```json
{ "name": "system.fetch" }
```

## 导入模块

```javascript
import fetch from '@system.fetch'
// 或
const fetch = require('@system.fetch')
```

## 接口定义

`fetch.fetch(OBJECT)` - 用于获取网络数据。

### 参数

| 参数名                  | 类型                              | 必填 | 说明                                                                                                                                                                                      |
| :---------------------- | :-------------------------------- | :--- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `url`                 | String                            | 是   | 资源 URL。                                                                                                                                                                                |
| `data`                | String/Object/ArrayBuffer (1030+) | 否   | 请求的参数，可以是字符串、JS 对象或 ArrayBuffer 对象。详情请参考下文的 `data`与 `Content-Type`关系部分。                                                                              |
| `header`              | Object                            | 否   | 请求的 header，会将其所有属性设置到请求的 header 部分。`User-Agent`从 1040 版本开始支持。示例：`{"Accept-Encoding": "gzip, deflate","Accept-Language": "zh-CN,en-US;q=0.8,en;q=0.6"}` |
| `method`              | String                            | 否   | 默认为 `GET`，可选值：`OPTIONS`、`GET`、`HEAD`、`POST`、`PUT`、`DELETE`、`TRACE`、`CONNECT`、`PATCH`(1200+)。                                                         |
| `responseType`(1030+) | String                            | 否   | 支持返回类型为 `text`、`json`、`file`、`arraybuffer`。默认会根据服务器返回 header 中的 `Content-Type`确定返回类型。详见 `success`返回值部分。                                 |
| `success`             | Function                          | 否   | 成功返回的回调函数。                                                                                                                                                                      |
| `fail`                | Function                          | 否   | 失败的回调函数，可能因为权限问题失败。                                                                                                                                                    |
| `complete`            | Function                          | 否   | 结束的回调函数（无论成功或失败都会执行）。                                                                                                                                                |

### `data` 与 `Content-Type` 关系

| `data`            | `Content-Type`                                     | 说明                                                                                                                                     |
| :------------------ | :--------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| String              | 不设置                                               | `Content-Type`默认为 `text/plain`，`data`值作为请求的 body。                                                                       |
| String              | 任意 Type                                            | `data`值作为请求的 body。                                                                                                              |
| Object              | 不设置                                               | `Content-Type`默认为 `application/x-www-form-urlencoded`，`data`按照 URL 规则进行 encode 并拼接作为请求的 body。                   |
| Object              | `application/x-www-form-urlencoded`                | `data`按照 URL 规则进行 encode 并拼接作为请求的 body。                                                                                 |
| Object              | `application/x-www-form-urlencoded`之外的任意 type | 1010 以前版本会调用失败；从 1010 版本开始，如果 manifest 中声明的 `minPlatformVersion>=1010`，会将 `data`转为字符串作为请求的 body。 |
| ArrayBuffer (1030+) | 不设置                                               | `Content-Type`默认为 `application/octet-stream`，`data`值作为请求的 body。                                                         |
| ArrayBuffer (1030+) | 任意 Type                                            | `data`值作为请求的 body。                                                                                                              |

### `success` 返回值

| 参数名      | 类型                                      | 说明                                                           |
| :---------- | :---------------------------------------- | :------------------------------------------------------------- |
| `code`    | Integer                                   | 服务器状态码。                                                 |
| `data`    | String/Object (1030+)/ArrayBuffer (1030+) | 参考下文的 `responseType`与 `success`中 `data`关系部分。 |
| `headers` | Object                                    | 服务器 response 的所有 header。                                |

### `responseType` 与 `success` 中 `data` 关系

| `responseType`       | `data`    | 说明                                                                                                                                                                                                                                           |
| :--------------------- | :---------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 无                     | String      | 如果服务器返回的 header 中 `Content-Type`是 `text/*`、`application/json`、`application/javascript`或 `application/xml`，则值为文本内容；否则是存储的临时文件的 URI。临时文件如果是图片或视频，可直接用于 `image`或 `video`控件。 |
| `text`               | String      | 返回普通文本。                                                                                                                                                                                                                                 |
| `json`(1030+)        | Object      | 返回 JS 对象。                                                                                                                                                                                                                                 |
| `file`               | String      | 返回存储的临时文件的 URI。                                                                                                                                                                                                                     |
| `arraybuffer`(1030+) | ArrayBuffer | 返回 ArrayBuffer 对象。                                                                                                                                                                                                                        |

## 示例

### 回调函数方式

```javascript
fetch.fetch({
  url: 'http://www.example.com',
  responseType: 'text',
  success: function(response) {
    console.log(`the status code of the response: ${response.code}`);
    console.log(`the data of the response: ${response.data}`);
    console.log(`the headers of the response: ${JSON.stringify(response.headers)}`);
  },
  fail: function(data, code) {
    console.log(`handling fail, errMsg = ${data}`);
    console.log(`handling fail, errCode = ${code}`);
  }
});
```

### Promise 方式

```javascript
fetch.fetch({
  url: 'http://www.example.com',
  responseType: 'text'
}).then(res => {
  const result = res.data;
  console.log(`the status code of the response: ${result.code}`);
  console.log(`the data of the response: ${result.data}`);
  console.log(`the headers of the response: ${JSON.stringify(result.headers)}`);
}).catch(error => {
  console.log(`handling fail, errMsg = ${error.data}`);
  console.log(`handling fail, errCode = ${error.code}`);
});
```

## 后台运行限制

无限制。详细用法参见“后台运行脚本”。
