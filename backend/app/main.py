from fastapi import FastAPI
from pydantic import BaseModel
import os
import requests
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent"

app = FastAPI(title="Prevención Médica Inteligente")

# Modelo para recibir síntomas
class Symptoms(BaseModel):
    name: str
    age: int
    symptoms: str

@app.get("/")
def home():
    return {"message": "Backend de Prevención Médica Inteligente funcionando!"}

@app.post("/triaje")
def triaje(data: Symptoms):
    prompt = f"Paciente {data.name}, {data.age} años, síntomas: {data.symptoms}. " \
             f"Primero responde en un mensaje de párrafo breve para el usuario, " \
             f"luego responde en el formato 'titulo|mis sintomas|riesgo(leve,mediano,critico)|Causa|Recomendacion'. " \
             f"Separa las dos respuestas con '%%%'. Evalúa el nivel de riesgo y da una recomendación inicial."

    response = requests.post(
        GEMINI_URL,
        headers={"Content-Type": "application/json"},
        params={"key": API_KEY},
        json={
            "contents": [
                {"parts": [{"text": prompt}]}
            ]
        }
    )

    result = response.json()

    try:
        texto = result["candidates"][0]["content"]["parts"][0]["text"]
        return {"resultado": texto}
    except Exception as e:
        return {"error": "No se pudo procesar la respuesta", "detalle": str(e), "raw": result}

    return response.json()
