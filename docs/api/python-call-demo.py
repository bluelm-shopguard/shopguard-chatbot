from openai import OpenAI

client = OpenAI(api_key="NONE", base_url="http://localhost:8000/v1")

completion = client.chat.completions.create(
    model="vivo-BlueLM-TB-Pro",
    messages=[{"role": "user", "content": "淘宝上有500块的苹果15,可信吗?"}],
    temperature=0.7,
    max_tokens=1024,
    user="requests_test_user",
)

print(completion.choices[0].message)
