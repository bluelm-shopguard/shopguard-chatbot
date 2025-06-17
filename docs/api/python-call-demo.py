from openai import OpenAI

client = OpenAI(api_key="YOUR_API_KEY", base_url="https://vip.apiyi.com/v1")

completion = client.chat.completions.create(
    model="gpt-4o-mini",
    stream=False,
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello!"},
    ],
)

print(completion.choices[0].message)
