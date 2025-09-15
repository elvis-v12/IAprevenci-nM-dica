import { useState } from "react";

function ChatBot() {
  const [mensaje, setMensaje] = useState("");
  const [respuesta, setRespuesta] = useState("");

  const enviarConsulta = async () => {
    const res = await fetch("http://127.0.0.1:8000/triaje", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Paciente Demo",
        age: 22,
        symptoms: mensaje,
      }),
    });
    const data = await res.json();
    setRespuesta(data.resultado || "Error en la consulta");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>Chat Bot - Consulta</h2>
      <textarea
        placeholder="Escribe tus síntomas..."
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
      />
      <br />
      <button onClick={enviarConsulta}>Enviar</button>
      {respuesta && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
          <strong>Respuesta del sistema:</strong>
          <p>{respuesta}</p>
        </div>
      )}
    </div>
  );
}

export default ChatBot;
