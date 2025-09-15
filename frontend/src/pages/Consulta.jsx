import React, { useState } from "react";
import "./Consulta.css";

export default function Consulta() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hola, ¿tienes alguna consulta?", sender: "bot" },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([
      ...messages,
      { text: input, sender: "user" },
      { text: "Procesando tu consulta...", sender: "bot" },
    ]);
    setInput("");
  };

  return (
    <div className="consulta-container">
      <h2>Chat Bot - Consulta</h2>
      <div className="chat-container">
        <img src="/bot.png" alt="bot" className="chat-bot" />
        <div className="chat-box">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`chat-message ${
                msg.sender === "user" ? "chat-user" : "chat-bot-msg"
              }`}
            >
              {msg.text}
            </div>
          ))}
          <textarea
            rows="3"
            placeholder="Escribe tus síntomas..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={handleSend}>Enviar</button>
        </div>
      </div>
    </div>
  );
}
