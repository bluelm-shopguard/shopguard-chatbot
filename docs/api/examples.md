# API Usage Examples

This section provides practical examples of using the ShopGuard API for various use cases, from basic chat implementations to advanced fraud detection scenarios.

## Basic Chat Implementation

### Simple Chat Request

```python
from openai import OpenAI

# Initialize client
client = OpenAI(
    api_key="your-api-key",
    base_url="http://localhost:8000/v1"
)

# Basic chat completion
def simple_chat(user_message):
    response = client.chat.completions.create(
        model="vivo-BlueLM-TB-Pro",
        messages=[
            {"role": "user", "content": user_message}
        ],
        temperature=0.7,
        max_tokens=1024
    )
    
    return response.choices[0].message.content

# Usage
user_input = "Hello, can you help me check if a deal is legitimate?"
reply = simple_chat(user_input)
print(reply)
```

### JavaScript/Node.js Example

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'your-api-key',
  baseURL: 'http://localhost:8000/v1'
});

async function chatWithAssistant(message) {
  try {
    const completion = await client.chat.completions.create({
      model: 'vivo-BlueLM-TB-Pro',
      messages: [{ role: 'user', content: message }],
      temperature: 0.7,
      max_tokens: 1024
    });
    
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Chat error:', error);
    throw error;
  }
}

// Usage
const response = await chatWithAssistant(
  "I found an iPhone 15 for $500, is this legitimate?"
);
console.log(response);
```

### Quick App Integration

```javascript
// Quick App implementation
export default {
  data: {
    messages: [],
    inputText: '',
    isLoading: false
  },
  
  async sendMessage() {
    if (!this.inputText.trim()) return;
    
    const userMessage = this.inputText;
    this.inputText = '';
    
    // Add user message to chat
    this.messages.push({
      role: 'user',
      content: userMessage,
      timestamp: Date.now()
    });
    
    this.isLoading = true;
    
    try {
      const response = await this.callChatAPI(userMessage);
      
      // Add assistant response
      this.messages.push({
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      });
      
    } catch (error) {
      console.error('API call failed:', error);
      this.showToast('Sorry, something went wrong. Please try again.');
    } finally {
      this.isLoading = false;
    }
  },
  
  async callChatAPI(message) {
    const response = await fetch('http://localhost:8000/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-api-key'
      },
      body: JSON.stringify({
        model: 'vivo-BlueLM-TB-Pro',
        messages: [
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  }
}
```

## Streaming Chat Implementation

### Python Streaming Example

```python
import asyncio
from openai import AsyncOpenAI

client = AsyncOpenAI(
    api_key="your-api-key",
    base_url="http://localhost:8000/v1"
)

async def stream_chat(message, on_chunk=None):
    """Stream chat response with real-time updates"""
    
    stream = await client.chat.completions.create(
        model="vivo-BlueLM-TB-Pro",
        messages=[{"role": "user", "content": message}],
        stream=True,
        max_tokens=1024
    )
    
    full_response = ""
    
    async for chunk in stream:
        content = chunk.choices[0].delta.content
        if content:
            full_response += content
            if on_chunk:
                on_chunk(content)
    
    return full_response

# Usage with callback
def print_chunk(chunk):
    print(chunk, end='', flush=True)

async def main():
    await stream_chat(
        "Analyze this deal: MacBook Pro 16\" for $800",
        on_chunk=print_chunk
    )

# Run the async function
asyncio.run(main())
```

### JavaScript Streaming

```javascript
async function streamChat(message, onChunk, onComplete) {
  try {
    const response = await fetch('http://localhost:8000/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-api-key',
      },
      body: JSON.stringify({
        model: 'vivo-BlueLM-TB-Pro',
        messages: [{ role: 'user', content: message }],
        stream: true,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
          try {
            const jsonStr = line.slice(6); // Remove 'data: '
            const data = JSON.parse(jsonStr);
            const content = data.choices[0]?.delta?.content || '';
            
            if (content) {
              fullResponse += content;
              onChunk(content);
            }
          } catch (e) {
            // Skip invalid JSON lines
          }
        }
      }
    }

    onComplete(fullResponse);
  } catch (error) {
    console.error('Streaming error:', error);
    throw error;
  }
}

// Usage
streamChat(
  "Is this Amazon seller trustworthy?",
  (chunk) => {
    // Update UI with each chunk
    document.getElementById('response').textContent += chunk;
  },
  (fullResponse) => {
    // Handle completion
    console.log('Complete response:', fullResponse);
  }
);
```

## Fraud Detection Examples

### Shopping Link Analysis

```python
def analyze_shopping_link(url, description=""):
    """Analyze a shopping link for fraud indicators"""
    
    prompt = f"""
    Please analyze this shopping link for potential fraud:
    
    URL: {url}
    Description: {description}
    
    Provide a detailed fraud risk assessment including:
    1. Risk level (0-10 stars)
    2. Specific risk factors
    3. Price analysis if applicable
    4. Recommendations for the user
    """
    
    response = client.chat.completions.create(
        model="vivo-BlueLM-TB-Pro",
        messages=[
            {
                "role": "system",
                "content": "You are an expert in online shopping fraud detection. Provide detailed, accurate analysis of shopping links and deals."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3,  # Lower temperature for analytical tasks
        max_tokens=800
    )
    
    return response.choices[0].message.content

# Usage examples
analysis1 = analyze_shopping_link(
    "https://deal-site.com/iphone-15-pro-299",
    "iPhone 15 Pro 256GB - New, Unlocked"
)

analysis2 = analyze_shopping_link(
    "https://amazon.com/dp/B08N5WRWNW",
    "MacBook Air M1 - Refurbished"
)

print("Analysis 1:", analysis1)
print("Analysis 2:", analysis2)
```

### Multi-modal Fraud Detection

```python
import base64

def analyze_shopping_screenshot(image_path, user_question):
    """Analyze a screenshot of a shopping page"""
    
    # Read and encode image
    with open(image_path, "rb") as image_file:
        image_data = base64.b64encode(image_file.read()).decode('utf-8')
    
    response = client.chat.completions.create(
        model="vivo-BlueLM-V-2.0",  # Vision model
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": f"Analyze this shopping page screenshot for fraud indicators. User question: {user_question}"
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{image_data}",
                            "detail": "high"
                        }
                    }
                ]
            }
        ],
        max_tokens=1000
    )
    
    return response.choices[0].message.content

# Usage
screenshot_analysis = analyze_shopping_screenshot(
    "shopping_page_screenshot.jpg",
    "Is this website legitimate? The prices seem too good to be true."
)

print("Screenshot Analysis:", screenshot_analysis)
```

## Conversation Management

### Chat History Management

```python
class ChatSession:
    def __init__(self, system_prompt=None, max_history=20):
        self.messages = []
        self.max_history = max_history
        
        if system_prompt:
            self.messages.append({
                "role": "system",
                "content": system_prompt
            })
    
    def add_user_message(self, content):
        """Add a user message to the conversation"""
        self.messages.append({
            "role": "user", 
            "content": content
        })
        self._trim_history()
    
    def add_assistant_message(self, content):
        """Add an assistant message to the conversation"""
        self.messages.append({
            "role": "assistant",
            "content": content
        })
        self._trim_history()
    
    def _trim_history(self):
        """Keep conversation history within limits"""
        # Always keep system message if present
        system_messages = [msg for msg in self.messages if msg["role"] == "system"]
        other_messages = [msg for msg in self.messages if msg["role"] != "system"]
        
        if len(other_messages) > self.max_history:
            other_messages = other_messages[-self.max_history:]
        
        self.messages = system_messages + other_messages
    
    async def send_message(self, user_input):
        """Send a message and get response"""
        self.add_user_message(user_input)
        
        response = client.chat.completions.create(
            model="vivo-BlueLM-TB-Pro",
            messages=self.messages,
            temperature=0.7,
            max_tokens=1024
        )
        
        assistant_reply = response.choices[0].message.content
        self.add_assistant_message(assistant_reply)
        
        return assistant_reply
    
    def get_conversation_summary(self):
        """Get a summary of the conversation"""
        return {
            "message_count": len(self.messages),
            "user_messages": len([m for m in self.messages if m["role"] == "user"]),
            "assistant_messages": len([m for m in self.messages if m["role"] == "assistant"])
        }

# Usage
fraud_detection_prompt = """
You are ShopGuard AI, an expert assistant specialized in online shopping fraud detection. 
Help users identify potential scams, analyze deals, and make safe shopping decisions.
Always provide clear risk assessments and practical advice.
"""

chat = ChatSession(system_prompt=fraud_detection_prompt)

# Simulate conversation
response1 = await chat.send_message("Hello, I need help checking if a deal is legitimate.")
print("Assistant:", response1)

response2 = await chat.send_message("I found a Rolex watch for $50 on a website called 'luxury-deals-now.com'")
print("Assistant:", response2)

print("Conversation summary:", chat.get_conversation_summary())
```

## Error Handling and Resilience

### Robust Error Handling

```python
import time
import random
from typing import Optional

class ResilientChatClient:
    def __init__(self, api_key: str, base_url: str, max_retries: int = 3):
        self.client = OpenAI(api_key=api_key, base_url=base_url)
        self.max_retries = max_retries
    
    async def send_message_with_retry(
        self, 
        messages: list, 
        model: str = "vivo-BlueLM-TB-Pro",
        **kwargs
    ) -> Optional[str]:
        """Send message with automatic retry logic"""
        
        last_error = None
        
        for attempt in range(self.max_retries):
            try:
                response = self.client.chat.completions.create(
                    model=model,
                    messages=messages,
                    **kwargs
                )
                
                return response.choices[0].message.content
                
            except Exception as error:
                last_error = error
                
                # Check if we should retry
                if not self._should_retry(error, attempt):
                    break
                
                # Calculate backoff delay
                delay = self._calculate_backoff(attempt)
                print(f"Attempt {attempt + 1} failed: {error}. Retrying in {delay}s...")
                time.sleep(delay)
        
        print(f"All {self.max_retries} attempts failed. Last error: {last_error}")
        return None
    
    def _should_retry(self, error, attempt: int) -> bool:
        """Determine if we should retry based on error type"""
        
        # Don't retry on final attempt
        if attempt >= self.max_retries - 1:
            return False
        
        # Retry on rate limits and server errors
        if hasattr(error, 'status_code'):
            return error.status_code in [429, 500, 502, 503, 504]
        
        # Retry on network errors
        return True
    
    def _calculate_backoff(self, attempt: int) -> float:
        """Calculate exponential backoff with jitter"""
        base_delay = 2 ** attempt
        jitter = random.uniform(0.1, 0.3)
        return base_delay + jitter

# Usage
resilient_client = ResilientChatClient(
    api_key="your-api-key",
    base_url="http://localhost:8000/v1"
)

# This will automatically retry on failures
response = await resilient_client.send_message_with_retry([
    {"role": "user", "content": "Analyze this suspicious email I received"}
])

if response:
    print("Success:", response)
else:
    print("Failed to get response after all retries")
```

### Rate Limiting Handling

```python
import asyncio
from datetime import datetime, timedelta

class RateLimitedClient:
    def __init__(self, api_key: str, base_url: str, requests_per_minute: int = 50):
        self.client = OpenAI(api_key=api_key, base_url=base_url)
        self.requests_per_minute = requests_per_minute
        self.request_times = []
        
    async def send_message(self, messages: list, **kwargs) -> str:
        """Send message with rate limiting"""
        
        # Wait if we've hit rate limit
        await self._wait_for_rate_limit()
        
        try:
            response = self.client.chat.completions.create(
                messages=messages,
                **kwargs
            )
            
            # Record successful request time
            self.request_times.append(datetime.now())
            
            return response.choices[0].message.content
            
        except Exception as error:
            if hasattr(error, 'status_code') and error.status_code == 429:
                # Rate limited - wait and retry once
                await asyncio.sleep(60)  # Wait 1 minute
                return await self.send_message(messages, **kwargs)
            else:
                raise error
    
    async def _wait_for_rate_limit(self):
        """Wait if we're approaching rate limit"""
        
        now = datetime.now()
        minute_ago = now - timedelta(minutes=1)
        
        # Remove old request times
        self.request_times = [
            t for t in self.request_times 
            if t > minute_ago
        ]
        
        # Wait if we're at the limit
        if len(self.request_times) >= self.requests_per_minute:
            oldest_request = min(self.request_times)
            wait_until = oldest_request + timedelta(minutes=1)
            
            if wait_until > now:
                wait_seconds = (wait_until - now).total_seconds()
                print(f"Rate limit reached. Waiting {wait_seconds:.1f} seconds...")
                await asyncio.sleep(wait_seconds)

# Usage
rate_limited_client = RateLimitedClient(
    api_key="your-api-key",
    base_url="http://localhost:8000/v1",
    requests_per_minute=50
)

# Send multiple messages - automatically rate limited
messages = [
    "Check this deal: laptop for $200",
    "Is this crypto investment legitimate?",
    "Analyze this phishing email"
]

for msg in messages:
    response = await rate_limited_client.send_message([
        {"role": "user", "content": msg}
    ])
    print(f"Q: {msg}")
    print(f"A: {response}\n")
```

## Advanced Usage Patterns

### Batch Processing

```python
import asyncio
from typing import List, Dict

async def process_multiple_queries(queries: List[str]) -> List[Dict]:
    """Process multiple fraud detection queries in parallel"""
    
    async def analyze_single_query(query: str) -> Dict:
        try:
            response = client.chat.completions.create(
                model="vivo-BlueLM-TB-Pro",
                messages=[
                    {
                        "role": "system",
                        "content": "Analyze the following for fraud indicators and provide a risk assessment."
                    },
                    {
                        "role": "user",
                        "content": query
                    }
                ],
                temperature=0.3,
                max_tokens=500
            )
            
            return {
                "query": query,
                "status": "success",
                "analysis": response.choices[0].message.content
            }
            
        except Exception as error:
            return {
                "query": query,
                "status": "error",
                "error": str(error)
            }
    
    # Process queries concurrently (with reasonable limit)
    semaphore = asyncio.Semaphore(5)  # Limit concurrent requests
    
    async def sem_analyze(query):
        async with semaphore:
            return await analyze_single_query(query)
    
    tasks = [sem_analyze(query) for query in queries]
    results = await asyncio.gather(*tasks)
    
    return results

# Usage
suspicious_queries = [
    "iPhone 15 Pro Max for $300 from 'apple-store-discount.net'",
    "Investment opportunity: 50% returns guaranteed in 30 days",
    "Amazon seller with 0 reviews selling luxury watches 90% off",
    "Email claiming I won lottery I never entered"
]

results = await process_multiple_queries(suspicious_queries)

for result in results:
    print(f"Query: {result['query']}")
    print(f"Status: {result['status']}")
    if result['status'] == 'success':
        print(f"Analysis: {result['analysis']}")
    else:
        print(f"Error: {result['error']}")
    print("-" * 50)
```

### Custom Response Parsing

```python
import json
import re
from dataclasses import dataclass
from typing import Optional

@dataclass
class FraudAnalysis:
    risk_level: int  # 0-10
    risk_factors: List[str]
    recommendation: str
    confidence: float
    price_analysis: Optional[Dict] = None

def parse_fraud_response(response_text: str) -> FraudAnalysis:
    """Parse structured fraud analysis from response text"""
    
    # Extract risk level (星 rating)
    risk_match = re.search(r'(\d+)星', response_text)
    risk_level = int(risk_match.group(1)) if risk_match else 5
    
    # Extract risk factors
    risk_factors = []
    for pattern in [
        r'风险因素[:：]\s*(.+?)(?:\n|$)',
        r'suspicious.*?[:：]\s*(.+?)(?:\n|$)',
        r'red flags?[:：]\s*(.+?)(?:\n|$)'
    ]:
        match = re.search(pattern, response_text, re.IGNORECASE)
        if match:
            factors = [f.strip() for f in match.group(1).split(',')]
            risk_factors.extend(factors)
    
    # Extract recommendation
    rec_patterns = [
        r'建议[:：]\s*(.+?)(?:\n\n|$)',
        r'recommendation[:：]\s*(.+?)(?:\n\n|$)',
        r'advice[:：]\s*(.+?)(?:\n\n|$)'
    ]
    
    recommendation = "Exercise caution"
    for pattern in rec_patterns:
        match = re.search(pattern, response_text, re.IGNORECASE | re.DOTALL)
        if match:
            recommendation = match.group(1).strip()
            break
    
    # Calculate confidence based on response detail
    confidence = min(0.9, len(response_text) / 1000)
    
    return FraudAnalysis(
        risk_level=risk_level,
        risk_factors=risk_factors,
        recommendation=recommendation,
        confidence=confidence
    )

# Usage
def analyze_with_structured_output(query: str) -> FraudAnalysis:
    response = client.chat.completions.create(
        model="vivo-BlueLM-TB-Pro",
        messages=[
            {
                "role": "system",
                "content": """
                You are a fraud detection expert. For each query, provide:
                1. Risk level (0-10 stars, use format: X星)
                2. Risk factors (list specific concerns)
                3. Clear recommendation
                4. Detailed explanation
                """
            },
            {
                "role": "user",
                "content": query
            }
        ]
    )
    
    raw_response = response.choices[0].message.content
    return parse_fraud_response(raw_response)

# Test the structured parsing
analysis = analyze_with_structured_output(
    "Found a 'limited time offer' for Rolex watches at 95% discount from an unknown website"
)

print(f"Risk Level: {analysis.risk_level}/10")
print(f"Risk Factors: {', '.join(analysis.risk_factors)}")
print(f"Recommendation: {analysis.recommendation}")
print(f"Confidence: {analysis.confidence:.2f}")
```

## Next Steps

- **[Basic Chat Tutorial](../tutorials/basic-chat.md)**: Step-by-step implementation guide
- **[Backend Setup](backend.md)**: Server configuration and deployment
- **[Frontend Integration](../development/frontend.md)**: Quick App integration patterns
