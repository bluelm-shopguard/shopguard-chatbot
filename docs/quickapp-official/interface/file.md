
# `system.file` API 文档

## 接口声明
```json
{ "name": "system.file" }
```

## 导入模块
```javascript
import file from '@system.file'
// 或者
const file = require('@system.file')
```

**注**：接口中使用的 URI 描述请参考官方的**文件组织**文档。

---

## 接口定义

### `file.move(OBJECT)`
将源文件移动到指定位置。

- **参数**
    | 参数名 | 类型 | 必填 | 说明 |
    | :--- | :--- | :--- | :--- |
    | `srcUri` | `String` | 是 | 源文件的 URI，不能是应用资源路径和 `tmp` 类型的 URI |
    | `dstUri` | `String` | 是 | 目标文件的 URI，不能是应用资源路径和 `tmp` 类型的 URI |
    | `success` | `Function` | 否 | 成功回调，返回目标文件的 URI |
    | `fail` | `Function` | 否 | 失败回调 |
    | `complete` | `Function` | 否 | 执行结束后的回调 |

- **`fail` 返回错误代码**
    | 错误码 | 说明 |
    | :--- | :--- |
    | 202 | 参数错误 |
    | 300 | I/O 错误 |

- **示例**
    ```javascript
    file.move({
      srcUri: 'internal://cache/path/to/file',
      dstUri: 'internal://files/path/to/file',
      success: function(uri) {
        console.log(`move success: ${uri}`)
      },
      fail: function(data, code) {
        console.log(`handling fail, code = ${code}`)
      }
    })
    ```

### `file.copy(OBJECT)`
将源文件复制一份并存储到指定位置。

- **参数**
    | 参数名 | 类型 | 必填 | 说明 |
    | :--- | :--- | :--- | :--- |
    | `srcUri` | `String` | 是 | 源文件的 URI |
    | `dstUri` | `String` | 是 | 目标文件的 URI，不能是应用资源路径和 `tmp` 类型的 URI |
    | `success` | `Function` | 否 | 成功回调，返回目标文件的 URI |
    | `fail` | `Function` | 否 | 失败回调 |
    | `complete` | `Function` | 否 | 执行结束后的回调 |

- **`fail` 返回错误代码**
    | 错误码 | 说明 |
    | :--- | :--- |
    | 202 | 参数错误 |
    | 300 | I/O 错误 |

- **示例**
    ```javascript
    file.copy({
      srcUri: 'internal://cache/path/to/file',
      dstUri: 'internal://files/path/to/file',
      success: function(uri) {
        console.log(`copy success: ${uri}`)
      },
      fail: function(data, code) {
        console.log(`handling fail, code = ${code}`)
      }
    })
    ```

### `file.list(OBJECT)`
获取指定目录下的文件列表。

- **参数**
    | 参数名 | 类型 | 必填 | 说明 |
    | :--- | :--- | :--- | :--- |
    | `uri` | `String` | 是 | 目录 URI。不能是应用资源路径和 `tmp` 类型的 URI (1080+ 支持应用资源路径) |
    | `success` | `Function` | 否 | 成功回调 |
    | `fail` | `Function` | 否 | 失败回调 |
    | `complete` | `Function` | 否 | 执行结束后的回调 |

- **`success` 返回值**
    - `fileList` (`Array`): 文件列表，每个文件是一个包含 `uri`, `length`, `lastModifiedTime` 的对象。
        - `uri` (`String`): 文件的 URI。
        - `length` (`Number`): 文件大小，单位 B。
        - `lastModifiedTime` (`Number`): 文件的保存时间戳（毫秒）。

- **`fail` 返回错误代码**
    | 错误码 | 说明 |
    | :--- | :--- |
    | 202 | 参数错误 |
    | 300 | I/O 错误 |

- **示例**
    ```javascript
    file.list({
      uri: 'internal://files/movies/',
      success: function(data) {
        console.log(data.fileList)
      },
      fail: function(data, code) {
        console.log(`handling fail, code = ${code}`)
      }
    })
    ```

### `file.get(OBJECT)`
获取本地文件的文件信息。

- **参数**
    | 参数名 | 类型 | 必填 | 说明 |
    | :--- | :--- | :--- | :--- |
    | `uri` | `String` | 是 | 文件的 URI。不能是应用资源路径 (1080+ 支持) |
    | `recursive` (1060+) | `Boolean` | 否 | 是否递归获取子目录文件列表。默认 `false` |
    | `success` | `Function` | 否 | 成功回调 |
    | `fail` | `Function` | 否 | 失败回调 |
    | `complete` | `Function` | 否 | 执行结束后的回调 |

- **`success` 返回值**
    | 参数名 | 类型 | 说明 |
    | :--- | :--- | :--- |
    | `uri` | `String` | 文件的 URI |
    | `length` | `Number` | 文件大小，单位 B |
    | `lastModifiedTime` | `Number` | 文件的保存时间戳（毫秒） |
    | `type` (1060+) | `String` | 文件类型，`dir`：目录；`file`：文件 |
    | `subFiles` (1060+) | `Array` | 当 `recursive` 为 `true` 且 `type` 为 `dir` 时，递归返回子目录文件信息，否则不返回。 |

- **`fail` 返回错误代码**
    | 错误码 | 说明 |
    | :--- | :--- |
    | 202 | 参数错误 |
    | 300 | I/O 错误 |

- **示例**
    ```javascript
    file.get({
      uri: 'internal://files/path/to/file',
      success: function(data) {
        console.log(data.uri)
        console.log(data.length)
        console.log(data.lastModifiedTime)
      },
      fail: function(data, code) {
        console.log(`handling fail, code = ${code}`)
      }
    })
    ```

### `file.delete(OBJECT)`
删除本地存储的文件。

- **参数**
    | 参数名 | 类型 | 必填 | 说明 |
    | :--- | :--- | :--- | :--- |
    | `uri` | `String` | 是 | 需要删除的文件 URI，不能是应用资源路径和 `tmp` 类型的 URI |
    | `success` | `Function` | 否 | 成功回调 |
    | `fail` | `Function` | 否 | 失败回调 |
    | `complete` | `Function` | 否 | 执行结束后的回调 |

- **`fail` 返回错误代码**
    | 错误码 | 说明 |
    | :--- | :--- |
    | 202 | 参数错误 |
    | 300 | I/O 错误 |

- **示例**
    ```javascript
    file.delete({
      uri: 'internal://files/path/to/file',
      success: function(data) {
        console.log('handling success')
      },
      fail: function(data, code) {
        console.log(`handling fail, code = ${code}`)
      }
    })
    ```

### `file.writeText(OBJECT)` (1010+)
写文本到文件。

- **参数**
    | 参数名 | 类型 | 必填 | 说明 |
    | :--- | :--- | :--- | :--- |
    | `uri` | `String` | 是 | 本地文件路径，不支持资源文件路径和 `tmp` 分区。如果文件不存在会创建文件。 |
    | `text` | `String` | 是 | 需要写入的字符串。 |
    | `encoding` | `String` | 否 | 编码格式，默认 `UTF-8`。 |
    | `append` (1060+) | `Boolean` | 否 | 是否追加模式，默认 `false`。 |
    | `success` | `Function` | 否 | 成功回调 |
    | `fail` | `Function` | 否 | 失败回调 |
    | `complete` | `Function` | 否 | 执行结束后的回调 |

- **`fail` 返回错误代码**
    | 错误码 | 说明 |
    | :--- | :--- |
    | 202 | 参数错误 |
    | 300 | I/O 错误 |

- **示例**
    ```javascript
    file.writeText({
      uri: 'internal://files/work/demo.txt',
      text: 'test',
      success: function() {
        console.log('handling success')
      },
      fail: function(data, code) {
        console.log(`handling fail, code = ${code}`)
      }
    })
    ```

### `file.writeArrayBuffer(OBJECT)` (1010+)
写 Buffer 到文件。

- **参数**
    | 参数名 | 类型 | 必填 | 说明 |
    | :--- | :--- | :--- | :--- |
    | `uri` | `String` | 是 | 本地文件路径，不支持资源文件路径和 `tmp` 分区。如果文件不存在会创建文件。 |
    | `buffer` | `Uint8Array` | 是 | 需要写入的 Buffer。 |
    | `position` | `Number` | 否 | 指向文件开始写入数据的位置的偏移量，默认 `0`。 |
    | `append` (1060+) | `Boolean` | 否 | 是否追加模式，默认 `false`。当为 `true` 时，`position` 参数无效。 |
    | `success` | `Function` | 否 | 成功回调 |
    | `fail` | `Function` | 否 | 失败回调 |
    | `complete` | `Function` | 否 | 执行结束后的回调 |

- **`fail` 返回错误代码**
    | 错误码 | 说明 |
    | :--- | :--- |
    | 202 | 参数错误 |
    | 300 | I/O 错误 |

- **示例**
    ```javascript
    file.writeArrayBuffer({
      uri: 'internal://files/work/demo',
      buffer: buffer, // assuming 'buffer' is a Uint8Array
      success: function() {
        console.log('handling success')
      },
      fail: function(data, code) {
        console.log(`handling fail, code = ${code}`)
      }
    })
    ```

### `file.readText(OBJECT)` (1010+)
从文件中读取文本。

- **参数**
    | 参数名 | 类型 | 必填 | 说明 |
    | :--- | :--- | :--- | :--- |
    | `uri` | `String` | 是 | 本地文件路径。 |
    | `encoding` | `String` | 否 | 编码格式，默认 `UTF-8`。 |
    | `success` | `Function` | 否 | 成功回调 |
    | `fail` | `Function` | 否 | 失败回调 |
    | `complete` | `Function` | 否 | 执行结束后的回调 |

- **`success` 返回值**
    | 参数名 | 类型 | 说明 |
    | :--- | :--- | :--- |
    | `text` | `String` | 读取的文本 |

- **`fail` 返回错误代码**
    | 错误码 | 说明 |
    | :--- | :--- |
    | 202 | 参数错误 |
    | 300 | I/O 错误 |
    | 301 | 文件不存在 |

- **示例**
    ```javascript
    file.readText({
      uri: 'internal://files/work/demo.txt',
      success: function(data) {
        console.log('text: ' + data.text)
      },
      fail: function(data, code) {
        console.log(`handling fail, code = ${code}`)
      }
    })
    ```

### `file.readArrayBuffer(OBJECT)` (1010+)
从文件中读取 Buffer。

- **参数**
    | 参数名 | 类型 | 必填 | 说明 |
    | :--- | :--- | :--- | :--- |
    | `uri` | `String` | 是 | 本地文件路径。 |
    | `position`| `Number` | 否 | 读取的起始位置，默认值为文件的起始位置。 |
    | `length` | `Number` | 否 | 读取的长度，不填写则读取到文件结尾。 |
    | `success` | `Function` | 否 | 成功回调 |
    | `fail` | `Function` | 否 | 失败回调 |
    | `complete` | `Function` | 否 | 执行结束后的回调 |

- **`success` 返回值**
    | 参数名 | 类型 | 说明 |
    | :--- | :--- | :--- |
    | `buffer` | `Uint8Array` | 读取的文件内容 |

- **`fail` 返回错误代码**
    | 错误码 | 说明 |
    | :--- | :--- |
    | 202 | 参数错误 |
    | 300 | I/O 错误 |
    | 301 | 文件不存在 |

- **示例**
    ```javascript
    file.readArrayBuffer({
      uri: 'internal://files/work/demo',
      position: 100,
      length: 100,
      success: function(data) {
        console.log('buffer.length: ' + data.buffer.length)
      },
      fail: function(data, code) {
        console.log(`handling fail, code = ${code}`)
      }
    })
    ```

### `file.access(OBJECT)` (1060+)
判断文件或目录是否存在。

- **参数**
    | 参数名 | 类型 | 必填 | 说明 |
    | :--- | :--- | :--- | :--- |
    | `uri` | `String` | 是 | 目录或文件 URI。不能是应用资源路径和 `tmp` 类型的 URI (1080+ 支持应用资源路径)。 |
    | `success` | `Function` | 否 | 成功回调 |
    | `fail` | `Function` | 否 | 失败回调 |
    | `complete` | `Function` | 否 | 执行结束后的回调 |

- **`fail` 返回错误代码**
    | 错误码 | 说明 |
    | :--- | :--- |
    | 202 | 参数错误 |
    | 300 | I/O 错误 |

- **示例**
    ```javascript
    file.access({
      uri: 'internal://files/test',
      success: function(data) {
        console.log(`handling success: file or directory exists`)
      },
      fail: function(data, code) {
        console.log(`handling fail, code = ${code}`)
      }
    })
    ```

### `file.mkdir(OBJECT)` (1060+)
创建目录。

- **参数**
    | 参数名 | 类型 | 必填 | 说明 |
    | :--- | :--- | :--- | :--- |
    | `uri` | `String` | 是 | 目录的 URI，不能是应用资源路径和 `tmp` 类型的 URI。 |
    | `recursive` | `Boolean` | 否 | 是否递归创建该目录的上级目录。默认 `false`。 |
    | `success` | `Function` | 否 | 成功回调 |
    | `fail` | `Function` | 否 | 失败回调 |
    | `complete` | `Function` | 否 | 执行结束后的回调 |

- **`fail` 返回错误代码**
    | 错误码 | 说明 |
    | :--- | :--- |
    | 202 | 参数错误 |
    | 300 | I/O 错误 |

- **示例**
    ```javascript
    file.mkdir({
      uri: 'internal://files/dir/',
      recursive: true,
      success: function(data) {
        console.log(`handling success: directory created`)
      },
      fail: function(data, code) {
        console.log(`handling fail, code = ${code}`)
      }
    })
    ```

### `file.rmdir(OBJECT)` (1060+)
删除目录。

- **参数**
    | 参数名 | 类型 | 必填 | 说明 |
    | :--- | :--- | :--- | :--- |
    | `uri` | `String` | 是 | 目录的 URI，不能是应用资源路径和 `tmp` 类型的 URI。 |
    | `recursive` | `Boolean` | 否 | 是否递归删除子文件和子目录。默认 `false`。 |
    | `success` | `Function` | 否 | 成功回调 |
    | `fail` | `Function` | 否 | 失败回调 |
    | `complete` | `Function` | 否 | 执行结束后的回调 |

- **`fail` 返回错误代码**
    | 错误码 | 说明 |
    | :--- | :--- |
    | 202 | 参数错误 |
    | 300 | I/O 错误 |

- **示例**
    ```javascript
    file.rmdir({
      uri: 'internal://files/dir/',
      recursive: true,
      success: function(data) {
        console.log(`handling success: directory removed`)
      },
      fail: function(data, code) {
        console.log(`handling fail, code = ${code}`)
      }
    })
    ```

---

## 后台运行限制
无限制。后台运行详细用法参见后台运行脚本的官方文档。
