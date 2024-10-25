import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise ValueError("API key not found. Please set the GROQ_API_KEY in your .env file.")

client = Groq(api_key=api_key)

def generate_mcqs(prompt):
    completion = client.chat.completions.create(
        model="llama-3.2-11b-text-preview",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant who generates multiple-choice questions."
            },
            {
                "role": "user",
                "content": prompt
            },
        ],
        temperature=1,
        max_tokens=1024,
        top_p=1,
        stream=False,
        stop=None,
    )

    # Check the response structure
    print(completion)  # Debugging line to see the structure of the response

    # Access the content based on the actual structure of the response
    mcqs_content = completion.choices[0].message.content  # Access content correctly
    mcqs = mcqs_content.split('\n')  # Split into individual lines

    return mcqs
