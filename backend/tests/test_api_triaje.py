# tests/test_api_triaje.py
import time
import re
import json
from fastapi.testclient import TestClient
from app.main import app

P95_LIMIT_MS = 15000  # puedes dejar tu env-var si quieres

client = TestClient(app)


def _extract_json(payload):
    if isinstance(payload, dict):
        return payload
    m = re.search(r"```json\s*(\{.*\})\s*```", str(payload), flags=re.S)
    raw = m.group(1) if m else str(payload)
    return json.loads(raw)


def test_triaje_p95_en_5_llamadas():
    tiempos = []

    for _ in range(5):
        t0 = time.perf_counter()
        r = client.post(
            "/triaje",
            json={"name": "Elvis", "age": 20, "symptoms": "Fiebre"},
        )
        elapsed_ms = int((time.perf_counter() - t0) * 1000)

        assert r.status_code == 200, r.text
        data = r.json()

        assert "resultado" in data
        texto = data["resultado"]

        assert isinstance(texto, str)
        assert len(texto) > 20
        assert any(k in texto.lower() for k in [
            "riesgo", "recomendación", "recomendacion", "fiebre"
        ])

        tiempos.append(elapsed_ms)

    tiempos.sort()
    p95 = tiempos[max(0, int(round(0.95 * len(tiempos) - 1)))]
    assert p95 <= P95_LIMIT_MS, f"p95 excedido: {p95} ms; muestras={tiempos}"
