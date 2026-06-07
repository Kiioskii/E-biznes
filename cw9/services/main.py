import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel, Field

app = FastAPI(title="CW9 AI Services")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1)


class ChatResponse(BaseModel):
    reply: str


def get_openai_client() -> OpenAI:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY is not configured")
    return OpenAI(api_key=api_key)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    client = get_openai_client()
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    try:
        completion = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "Jesteś pomocnym asystentem. Odpowiadaj po polsku."},
                {"role": "user", "content": request.message},
            ],
        )
        reply = completion.choices[0].message.content or ""
        return ChatResponse(reply=reply)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
