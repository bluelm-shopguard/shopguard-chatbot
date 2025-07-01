# Backend API Reference

The ShopGuard backend provides a comprehensive API server built with FastAPI, offering OpenAI-compatible endpoints enhanced with specialized fraud detection capabilities.

## Server Overview

### Core Features

- **🔌 OpenAI Compatibility**: Full compatibility with OpenAI GPT API specification
- **🛡️ Fraud Detection**: Advanced shopping scam analysis and risk assessment
- **🖼️ Multi-modal Support**: Text and image processing capabilities
- **🧠 RAG Integration**: Retrieval-Augmented Generation with fraud knowledge base
- **🌐 Web Search**: Real-time information retrieval from multiple search engines
- **📡 Streaming**: Server-Sent Events (SSE) for real-time responses
- **⚡ High Performance**: Async processing with FastAPI framework

### Technology Stack

- **Framework**: FastAPI 0.104.1+
- **AI Model**: vivo BlueLM (TB-Pro and V-2.0)
- **Vector Database**: Chroma
- **Image Processing**: PIL, OCR libraries
- **Search Integration**: Multiple search engine APIs
- **Python Version**: 3.8+

## API Endpoints

### Chat Completions

#### `POST /v1/chat/completions`

OpenAI-compatible chat completion endpoint with enhanced fraud detection capabilities.

**Request Format:**

```json
{
  "model": "vivo-BlueLM-TB-Pro",
  "messages": [
    {
      "role": "user",
      "content": "I found a iPhone 15 for $500 on this website, is it legitimate?"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 1024,
  "stream": false,
  "user": "user_id_123"
}
```

**Response Format:**

```json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "vivo-BlueLM-TB-Pro",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Based on my analysis, this iPhone 15 deal appears highly suspicious...",
        "fraud_analysis": {
          "risk_level": "8星",
          "reason": "Price significantly below market value",
          "advice": "Avoid this deal, high probability of fraud"
        }
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 45,
    "completion_tokens": 156,
    "total_tokens": 201
  }
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `model` | string | Yes | Model name (`vivo-BlueLM-TB-Pro`, `vivo-BlueLM-V-2.0`) |
| `messages` | array | Yes | Array of message objects |
| `temperature` | float | No | Sampling temperature (0.0-2.0) |
| `max_tokens` | integer | No | Maximum tokens to generate |
| `stream` | boolean | No | Enable streaming response |
| `top_p` | float | No | Nucleus sampling parameter |
| `frequency_penalty` | float | No | Frequency penalty (-2.0 to 2.0) |
| `presence_penalty` | float | No | Presence penalty (-2.0 to 2.0) |
| `user` | string | No | Unique user identifier |

### Streaming Chat

#### `POST /v1/chat/completions` (with `stream: true`)

Real-time streaming responses using Server-Sent Events.

**Request:**

```json
{
  "model": "vivo-BlueLM-TB-Pro",
  "messages": [...],
  "stream": true
}
```

**Response (SSE format):**

```
data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1677652288,"model":"vivo-BlueLM-TB-Pro","choices":[{"index":0,"delta":{"content":"Based"},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1677652288,"model":"vivo-BlueLM-TB-Pro","choices":[{"index":0,"delta":{"content":" on"},"finish_reason":null}]}

data: [DONE]
```

### Multi-modal Support

#### Image Analysis

Include images in chat messages for visual fraud detection:

**Request with Image:**

```json
{
  "model": "vivo-BlueLM-V-2.0",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Analyze this shopping screenshot for potential fraud"
        },
        {
          "type": "image_url",
          "image_url": {
            "url": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
          }
        }
      ]
    }
  ]
}
```

**Supported Image Formats:**
- JPEG, PNG, WebP, GIF
- Base64 encoded data URLs
- HTTP/HTTPS image URLs
- Maximum size: 20MB

### Model Information

#### `GET /v1/models`

List available models and their capabilities.

**Response:**

```json
{
  "object": "list",
  "data": [
    {
      "id": "vivo-BlueLM-TB-Pro",
      "object": "model",
      "created": 1677610602,
      "owned_by": "vivo",
      "capabilities": [
        "chat",
        "fraud_detection",
        "text_analysis"
      ]
    },
    {
      "id": "vivo-BlueLM-V-2.0",
      "object": "model",
      "created": 1677610602,
      "owned_by": "vivo",
      "capabilities": [
        "chat",
        "fraud_detection",
        "vision",
        "multi_modal"
      ]
    }
  ]
}
```

## Fraud Detection Features

### Risk Assessment

The backend automatically analyzes user messages for fraud-related content and provides structured risk assessments:

```json
{
  "fraud_analysis": {
    "risk_level": "7星",
    "confidence": 0.85,
    "risk_factors": [
      "Abnormally low price",
      "Unknown seller",
      "Urgency tactics",
      "Payment method issues"
    ],
    "price_analysis": {
      "market_price": 999,
      "offered_price": 500,
      "discount_percentage": 50,
      "legitimacy_score": 0.2
    },
    "seller_analysis": {
      "reputation_score": 0.3,
      "account_age": "unknown",
      "verification_status": "unverified"
    }
  }
}
```

### Knowledge Base Integration

RAG (Retrieval-Augmented Generation) enhances responses with relevant fraud cases:

**Configuration:**

```json
{
  "rag_enabled": true,
  "max_retrievals": 5,
  "similarity_threshold": 0.7,
  "knowledge_domains": [
    "shopping_fraud",
    "investment_scams",
    "phishing_attempts",
    "fake_websites"
  ]
}
```

### Web Search Integration

Real-time information retrieval for enhanced analysis:

```json
{
  "search_enabled": true,
  "search_engines": ["google", "bing", "baidu"],
  "max_results": 3,
  "search_timeout": 5
}
```

## Configuration Options

### Environment Variables

```bash
# API Configuration
API_HOST=localhost
API_PORT=8000
API_KEY=your-secure-api-key

# vivo BlueLM Configuration
VIVO_API_KEY=your-vivo-api-key
VIVO_API_BASE=https://api.vivo.ai
VIVO_MODEL_TB_PRO=vivo-BlueLM-TB-Pro
VIVO_MODEL_VISION=vivo-BlueLM-V-2.0

# RAG Configuration
CHROMA_PERSIST_DIR=./chroma_db
EMBEDDING_MODEL=m3e-base
RAG_ENABLED=true

# Search Configuration
SEARCH_ENABLED=true
SEARCH_TIMEOUT=5
GOOGLE_API_KEY=your-google-api-key
BING_API_KEY=your-bing-api-key

# Performance
MAX_WORKERS=4
REQUEST_TIMEOUT=30
RATE_LIMIT_PER_MINUTE=100
```

### Runtime Configuration

```python
from pydantic import BaseSettings

class Settings(BaseSettings):
    # API Settings
    api_host: str = "localhost"
    api_port: int = 8000
    api_key: str = "default-key"
    
    # Model Settings
    default_model: str = "vivo-BlueLM-TB-Pro"
    max_tokens: int = 4096
    temperature: float = 0.7
    
    # Fraud Detection
    fraud_detection_enabled: bool = True
    risk_threshold: float = 0.5
    
    # Performance
    rate_limit: int = 100
    request_timeout: int = 30
    
    class Config:
        env_file = ".env"
```

## Error Handling

### Error Response Format

```json
{
  "error": {
    "message": "Model 'invalid-model' not found",
    "type": "invalid_request_error",
    "param": "model",
    "code": "model_not_found"
  }
}
```

### Common Error Codes

| HTTP Code | Error Type | Description | Resolution |
|-----------|------------|-------------|------------|
| 400 | `invalid_request_error` | Bad request format | Check request syntax |
| 401 | `authentication_error` | Invalid API key | Verify authentication |
| 403 | `permission_error` | Insufficient permissions | Check API key permissions |
| 429 | `rate_limit_error` | Too many requests | Implement rate limiting |
| 500 | `internal_server_error` | Server error | Contact support |
| 503 | `service_unavailable` | Service overloaded | Retry with backoff |

### Error Handling Best Practices

```python
import httpx
from typing import Optional

async def handle_api_request(
    endpoint: str,
    data: dict,
    max_retries: int = 3
) -> Optional[dict]:
    """Robust API request handling with retries"""
    
    for attempt in range(max_retries):
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    endpoint,
                    json=data,
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    return response.json()
                elif response.status_code == 429:
                    # Rate limited - exponential backoff
                    wait_time = 2 ** attempt
                    await asyncio.sleep(wait_time)
                    continue
                else:
                    # Log error and potentially retry
                    error_data = response.json()
                    print(f"API Error: {error_data}")
                    
                    if response.status_code >= 500:
                        # Server error - retry
                        continue
                    else:
                        # Client error - don't retry
                        return None
                        
        except httpx.TimeoutException:
            if attempt < max_retries - 1:
                continue
            print("Request timeout after all retries")
            return None
            
    return None
```

## Performance Optimization

### Async Processing

The backend uses FastAPI's async capabilities for high performance:

```python
@app.post("/v1/chat/completions")
async def chat_completions(request: ChatCompletionRequest):
    """Async chat completion endpoint"""
    
    # Parallel processing of multiple components
    tasks = []
    
    if request.enable_rag:
        tasks.append(retrieve_relevant_knowledge(request.messages))
    
    if request.enable_search:
        tasks.append(search_web_information(request.query))
    
    # Wait for all tasks to complete
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    # Generate response with enhanced context
    response = await generate_completion(request, additional_context=results)
    
    return response
```

### Caching Strategy

```python
from functools import lru_cache
import redis

# Redis cache for expensive operations
redis_client = redis.Redis(host='localhost', port=6379, db=0)

@lru_cache(maxsize=1000)
def get_cached_embedding(text: str) -> list:
    """Cache embedding calculations"""
    cache_key = f"embedding:{hash(text)}"
    
    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)
    
    embedding = calculate_embedding(text)
    redis_client.setex(cache_key, 3600, json.dumps(embedding))
    
    return embedding
```

### Monitoring and Metrics

```python
import time
from prometheus_client import Counter, Histogram

# Metrics collection
REQUEST_COUNT = Counter('api_requests_total', 'Total API requests', ['method', 'endpoint'])
REQUEST_DURATION = Histogram('api_request_duration_seconds', 'Request duration')

@app.middleware("http")
async def monitor_requests(request: Request, call_next):
    start_time = time.time()
    
    response = await call_next(request)
    
    duration = time.time() - start_time
    REQUEST_DURATION.observe(duration)
    REQUEST_COUNT.labels(method=request.method, endpoint=request.url.path).inc()
    
    return response
```

## Deployment Configuration

### Docker Setup

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Production Settings

```python
# production.py
from pydantic import BaseSettings

class ProductionSettings(BaseSettings):
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    workers: int = 4
    
    # Security
    api_key_required: bool = True
    cors_origins: list = ["https://your-domain.com"]
    
    # Performance
    max_request_size: int = 16 * 1024 * 1024  # 16MB
    timeout: int = 30
    
    # Logging
    log_level: str = "INFO"
    log_file: str = "/var/log/shopguard-api.log"
```

## Next Steps

- **[OpenAI Compatibility](openai-compatibility.md)**: Full compatibility reference
- **[Usage Examples](examples.md)**: Practical implementation examples
- **[Deployment Guide](../deployment/production.md)**: Production deployment instructions
