# OpenAI Compatibility

ShopGuard's backend API is fully compatible with the OpenAI GPT API specification, allowing seamless integration with existing OpenAI-based applications and tools.

## Compatibility Overview

### Supported Features

✅ **Full Compatibility**
- Chat Completions API (`/v1/chat/completions`)
- Streaming responses (Server-Sent Events)
- Message format and role system
- Temperature and sampling parameters
- Token usage tracking
- Error response format

✅ **Enhanced Features**
- Multi-modal input (text + images)
- Fraud detection analysis
- RAG-enhanced responses
- Web search integration
- Structured fraud risk assessments

❌ **Not Supported**
- Text completion API (legacy)
- Fine-tuning endpoints
- Embeddings API (separate implementation)
- Audio/speech endpoints
- File upload endpoints

## API Specification Compliance

### Chat Completions Endpoint

Our `/v1/chat/completions` endpoint follows the exact OpenAI specification:

```http
POST /v1/chat/completions
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
```

**Request Body (OpenAI Format):**

```json
{
  "model": "vivo-BlueLM-TB-Pro",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant specialized in fraud detection."
    },
    {
      "role": "user",
      "content": "Is this deal legitimate: iPhone 15 for $300?"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 1024,
  "top_p": 1,
  "frequency_penalty": 0,
  "presence_penalty": 0,
  "stream": false,
  "stop": null,
  "user": "user-123"
}
```

**Response (OpenAI Format):**

```json
{
  "id": "chatcmpl-7QyqpwdfhqwajicIEznoc6Q47XAyW",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "vivo-BlueLM-TB-Pro",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "This iPhone 15 deal for $300 appears highly suspicious..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 56,
    "completion_tokens": 31,
    "total_tokens": 87
  }
}
```

### Message Format

Fully supports OpenAI's message format with roles:

```json
{
  "messages": [
    {
      "role": "system",
      "content": "System prompt defining assistant behavior"
    },
    {
      "role": "user", 
      "content": "User message or question"
    },
    {
      "role": "assistant",
      "content": "Assistant's previous response"
    },
    {
      "role": "user",
      "content": "Follow-up user message"
    }
  ]
}
```

### Multi-modal Messages (Vision)

Compatible with OpenAI's Vision API format:

```json
{
  "model": "vivo-BlueLM-V-2.0",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Analyze this shopping page screenshot"
        },
        {
          "type": "image_url",
          "image_url": {
            "url": "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAA...",
            "detail": "high"
          }
        }
      ]
    }
  ]
}
```

## Parameter Compatibility

### Core Parameters

| Parameter | OpenAI | ShopGuard | Notes |
|-----------|---------|-----------|-------|
| `model` | ✅ | ✅ | Maps to vivo BlueLM models |
| `messages` | ✅ | ✅ | Full message format support |
| `temperature` | ✅ | ✅ | 0.0 to 2.0 range |
| `max_tokens` | ✅ | ✅ | Maximum response length |
| `top_p` | ✅ | ✅ | Nucleus sampling |
| `frequency_penalty` | ✅ | ✅ | -2.0 to 2.0 range |
| `presence_penalty` | ✅ | ✅ | -2.0 to 2.0 range |
| `stream` | ✅ | ✅ | SSE streaming support |
| `stop` | ✅ | ✅ | Stop sequences |
| `user` | ✅ | ✅ | User identification |

### Extended Parameters

ShopGuard adds optional parameters while maintaining compatibility:

```json
{
  "model": "vivo-BlueLM-TB-Pro",
  "messages": [...],
  
  // Standard OpenAI parameters
  "temperature": 0.7,
  "max_tokens": 1024,
  
  // ShopGuard extensions (optional)
  "enable_fraud_detection": true,
  "enable_rag": true,
  "enable_web_search": false,
  "fraud_analysis_detail": "comprehensive"
}
```

## Model Mapping

### Available Models

| ShopGuard Model | Capabilities | OpenAI Equivalent |
|-----------------|-------------|-------------------|
| `vivo-BlueLM-TB-Pro` | Text, Fraud Detection | `gpt-3.5-turbo` |
| `vivo-BlueLM-V-2.0` | Text, Vision, Fraud Detection | `gpt-4-vision-preview` |

### Model Selection

```javascript
// Standard OpenAI client usage
const openai = new OpenAI({
  apiKey: 'your-api-key',
  baseURL: 'http://localhost:8000/v1'  // Point to ShopGuard backend
});

// Use exactly like OpenAI
const completion = await openai.chat.completions.create({
  model: 'vivo-BlueLM-TB-Pro',  // ShopGuard model
  messages: [
    { role: 'user', content: 'Hello!' }
  ]
});
```

## Streaming Compatibility

### Server-Sent Events

Full compatibility with OpenAI's streaming format:

```javascript
const stream = await openai.chat.completions.create({
  model: 'vivo-BlueLM-TB-Pro',
  messages: [{ role: 'user', content: 'Hello' }],
  stream: true,
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content || '';
  if (content) {
    process.stdout.write(content);
  }
}
```

**Streaming Response Format:**

```
data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1677652288,"model":"vivo-BlueLM-TB-Pro","choices":[{"index":0,"delta":{"content":"Hello"},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1677652288,"model":"vivo-BlueLM-TB-Pro","choices":[{"index":0,"delta":{"content":" there"},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1677652288,"model":"vivo-BlueLM-TB-Pro","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
```

## Error Handling

### Error Format Compatibility

ShopGuard returns errors in the exact OpenAI format:

```json
{
  "error": {
    "message": "Invalid request: the model `invalid-model` does not exist",
    "type": "invalid_request_error",
    "param": "model",
    "code": "model_not_found"
  }
}
```

### Error Type Mapping

| Error Type | HTTP Code | Description |
|------------|-----------|-------------|
| `invalid_request_error` | 400 | Bad request parameters |
| `authentication_error` | 401 | Invalid API key |
| `permission_error` | 403 | Insufficient permissions |
| `not_found_error` | 404 | Resource not found |
| `rate_limit_error` | 429 | Rate limit exceeded |
| `api_error` | 500 | Internal server error |
| `overloaded_error` | 503 | Server overloaded |

## Usage Examples

### Drop-in Replacement

Replace OpenAI API with ShopGuard backend:

```python
# Before (OpenAI)
from openai import OpenAI
client = OpenAI(api_key="sk-...")

# After (ShopGuard)
from openai import OpenAI
client = OpenAI(
    api_key="your-shopguard-key",
    base_url="http://localhost:8000/v1"
)

# Same code works with both!
response = client.chat.completions.create(
    model="vivo-BlueLM-TB-Pro",  # Just change the model name
    messages=[
        {"role": "user", "content": "Hello!"}
    ]
)
```

### Fraud Detection Enhancement

Use standard OpenAI format with automatic fraud detection:

```python
def analyze_shopping_query(user_message):
    response = client.chat.completions.create(
        model="vivo-BlueLM-TB-Pro",
        messages=[
            {
                "role": "system", 
                "content": "You are a fraud detection expert. Analyze shopping queries for potential scams."
            },
            {
                "role": "user", 
                "content": user_message
            }
        ],
        temperature=0.3,  # Lower temperature for analytical tasks
        max_tokens=800
    )
    
    return response.choices[0].message.content
```

### Multi-modal Analysis

```python
def analyze_shopping_screenshot(image_data, user_question):
    response = client.chat.completions.create(
        model="vivo-BlueLM-V-2.0",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": user_question
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{image_data}"
                        }
                    }
                ]
            }
        ]
    )
    
    return response.choices[0].message.content
```

## Migration Guide

### From OpenAI to ShopGuard

1. **Change Base URL**:
   ```python
   # Update your client initialization
   client = OpenAI(
       api_key="your-shopguard-key",
       base_url="http://your-shopguard-server/v1"  # Add this line
   )
   ```

2. **Update Model Names**:
   ```python
   # Replace OpenAI models with ShopGuard models
   "gpt-3.5-turbo" → "vivo-BlueLM-TB-Pro"
   "gpt-4-vision-preview" → "vivo-BlueLM-V-2.0"
   ```

3. **No Code Changes Required**:
   - All existing OpenAI code works unchanged
   - Same response format and error handling
   - Streaming works identically

### Testing Compatibility

```python
import pytest
from openai import OpenAI

def test_openai_compatibility():
    # Test with ShopGuard backend
    client = OpenAI(
        api_key="test-key",
        base_url="http://localhost:8000/v1"
    )
    
    response = client.chat.completions.create(
        model="vivo-BlueLM-TB-Pro",
        messages=[{"role": "user", "content": "Hello"}]
    )
    
    # Verify OpenAI-compatible response structure
    assert hasattr(response, 'id')
    assert hasattr(response, 'object')
    assert hasattr(response, 'created')
    assert hasattr(response, 'model')
    assert hasattr(response, 'choices')
    assert hasattr(response, 'usage')
    
    # Verify choice structure
    choice = response.choices[0]
    assert hasattr(choice, 'index')
    assert hasattr(choice, 'message')
    assert hasattr(choice, 'finish_reason')
    
    # Verify message structure
    message = choice.message
    assert hasattr(message, 'role')
    assert hasattr(message, 'content')
    assert message.role == 'assistant'
```

## Advanced Features

### Enhanced Response Structure

While maintaining OpenAI compatibility, ShopGuard can provide enhanced responses:

```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "vivo-BlueLM-TB-Pro",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "This deal appears suspicious...",
        
        // Enhanced ShopGuard data (optional)
        "fraud_analysis": {
          "risk_level": "7星",
          "confidence": 0.85,
          "risk_factors": ["price_anomaly", "seller_unknown"]
        }
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 56,
    "completion_tokens": 31,
    "total_tokens": 87
  }
}
```

### Custom Headers

ShopGuard supports additional request headers for enhanced functionality:

```http
POST /v1/chat/completions
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
X-ShopGuard-Features: fraud-detection,rag,web-search
X-ShopGuard-User-Context: shopping,high-risk-tolerance
```

## Performance Considerations

### Latency Comparison

| Feature | OpenAI GPT-3.5 | ShopGuard | Notes |
|---------|----------------|-----------|--------|
| Basic chat | ~1-2s | ~1-3s | Comparable performance |
| With fraud detection | N/A | ~2-4s | Additional analysis time |
| With RAG | N/A | ~3-5s | Knowledge retrieval overhead |
| With web search | N/A | ~4-7s | Real-time search latency |

### Optimization Tips

1. **Disable unused features** for faster responses:
   ```json
   {
     "enable_fraud_detection": false,
     "enable_rag": false,
     "enable_web_search": false
   }
   ```

2. **Use streaming** for better perceived performance:
   ```python
   stream = client.chat.completions.create(
       model="vivo-BlueLM-TB-Pro",
       messages=messages,
       stream=True
   )
   ```

3. **Cache frequently used queries** at the application level.

## Next Steps

- **[Usage Examples](examples.md)**: Practical implementation examples
- **[Backend Implementation](backend.md)**: Technical details
- **[Integration Tutorial](../tutorials/basic-chat.md)**: Step-by-step guide
