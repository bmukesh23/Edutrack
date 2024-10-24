import os
from dotenv import load_dotenv
from groq import Groq

# Load environment variables from .env file
load_dotenv()

# Now the environment variable can be accessed
api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise ValueError("API key not found. Please set the GROQ_API_KEY in your .env file.")

client = Groq(api_key=api_key)

completion = client.chat.completions.create(
    model="llama-3.2-11b-text-preview",
    messages=[
        {
            "role": "system",
            "content": "You are a helpful assistant who generates multiple-choice questions."
        },
        {
            "role": "user",
            "content": "Generate 5 intermediate-level multiple-choice questions on Science."
        },
    ],
    temperature=1,
    max_tokens=1024,
    top_p=1,
    stream=True,
    stop=None,
)

for chunk in completion:
    print(chunk.choices[0].delta.content or "", end="")