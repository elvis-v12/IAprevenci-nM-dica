import { useState, useRef, useEffect } from "react";
import "./ChatBot.css";

function ChatBot() {
  const [mensajes, setMensajes] = useState([
    {
      tipo: "bot",
      texto: "¡Hola! Soy tu asistente médico virtual. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date(),
    },
  ]);

  const [inputMensaje, setInputMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const mensajesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll automático
  const scrollToBottom = () => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  // ---- Enviar mensaje ----
  const enviarMensaje = async () => {
    console.log("Enviando mensaje...");
    if (!inputMensaje.trim() || cargando) return;

    const mensajeUsuario = inputMensaje.trim();
    setInputMensaje("");

    setMensajes((prev) => [
      ...prev,
      {
        tipo: "usuario",
        texto: mensajeUsuario,
        timestamp: new Date(),
      },
    ]);

    setCargando(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/triaje", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Paciente Demo",
          age: 22,
          symptoms: mensajeUsuario,
        }),
      });

      const data = await res.json();
      const respuestaBot =
        data.resultado ||
        "Lo siento, hubo un error al procesar tu consulta.";

      setMensajes((prev) => [
        ...prev,
        {
          tipo: "bot",
          texto: respuestaBot,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error al consultar la API:", error);

      setMensajes((prev) => [
        ...prev,
        {
          tipo: "bot",
          texto:
            "Lo siento, no pude conectarme con el servidor. Intenta de nuevo más tarde.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setCargando(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  };

  const formatearHora = (fecha) =>
    fecha.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="header-content">
          <div className="bot-avatar">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z"
                fill="currentColor"
              />
            </svg>
          </div>

          <div className="header-info">
            <h2>Asistente Médico Virtual</h2>
            <p className="status">
              <span className="status-dot"></span>
              En línea
            </p>
          </div>
        </div>
      </div>

      <div className="chatbot-mensajes">
        {mensajes.map((mensaje, index) => (
          <div
            key={index}
            className={`mensaje-wrapper ${mensaje.tipo === "usuario" ? "usuario" : "bot"
              }`}
          >
            <div className={`mensaje ${mensaje.tipo}`}>
              <p>{mensaje.texto}</p>
              <span className="timestamp">{formatearHora(mensaje.timestamp)}</span>
            </div>
          </div>
        ))}

        {cargando && (
          <div className="mensaje-wrapper bot">
            <div className="mensaje bot">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={mensajesEndRef} />
      </div>

      <div className="chatbot-input">
        <div className="input-container">
          <textarea
            ref={inputRef}
            placeholder="Escribe tus síntomas o pregunta..."
            value={inputMensaje}
            onChange={(e) => setInputMensaje(e.target.value)}
            onKeyPress={handleKeyPress}
            rows="1"
            disabled={cargando}
          />

          <button
            onClick={enviarMensaje}
            disabled={!inputMensaje.trim() || cargando}
            className="send-button"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
