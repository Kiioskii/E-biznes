import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel, Field

app = FastAPI(title="CW9 AI Services")

STORE_SYSTEM_PROMPT = """Jesteś asystentem sklepu internetowego CW9.
Odpowiadaj wyłącznie na tematy związane ze sklepem:
- ubrania i odzież (np. bluzki, spodnie, buty, kurtki, sukienki),
- produkty i kategorie: Sport, Technologia, Muzyka, Gry,
- zakupy, koszyk, zamówienia, dostawa, płatności, zwroty i reklamacje,
- informacje o ofercie sklepu oraz obsłudze klienta.

Jeśli pytanie nie dotyczy sklepu, grzecznie odmów i zaproś do zadania pytania o sklep.
Odpowiadaj po polsku, zwięźle i pomocnie."""

OFF_TOPIC_REPLY = (
    "Odpowiadam wyłącznie na pytania związane ze sklepem internetowym — "
    "np. ubrania, produkty, kategorie (Sport, Technologia, Muzyka, Gry), "
    "zakupy, dostawa lub zwroty. Zadaj pytanie dotyczące sklepu."
)

STORE_TOPIC_KEYWORDS = (
    "sklep",
    "produkt",
    "kategori",
    "koszyk",
    "zamówien",
    "dostaw",
    "płatno",
    "platno",
    "zwrot",
    "reklamac",
    "ubran",
    "odzież",
    "odziez",
    "moda",
    "bluzk",
    "spodni",
    "buty",
    "kurtk",
    "sukien",
    "sport",
    "technologi",
    "muzyk",
    "gry",
    "laptop",
    "smartfon",
    "smartwatch",
    "gitar",
    "słuchaw",
    "sluchaw",
    "konsol",
    "piłk",
    "pilka",
    "rakieta",
    "hantl",
    "keyboard",
    "cena",
    "rabat",
    "promocj",
    "ofert",
    "zakup",
    "kupi",
    "polec",
    "rozmiar",
    "kolor",
    "materiał",
    "material",
    "asortyment",
    "dostępn",
    "dostepn",
    "cześć",
    "czesc",
    "hej",
    "witaj",
    "dzień dobry",
    "dzien dobry",
    "pomoc",
    "pomóż",
    "pomoz",
    "kategorie",
    "produkty",
)

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


def is_store_related(message: str) -> bool:
    normalized = message.lower().strip()
    if not normalized:
        return False

    return any(keyword in normalized for keyword in STORE_TOPIC_KEYWORDS)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    if not is_store_related(request.message):
        return ChatResponse(reply=OFF_TOPIC_REPLY)

    client = get_openai_client()
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    try:
        completion = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": STORE_SYSTEM_PROMPT},
                {"role": "user", "content": request.message},
            ],
        )
        reply = completion.choices[0].message.content or ""
        return ChatResponse(reply=reply)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
