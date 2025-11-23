function ChatMessage({ mensaje, tipo }) {
    const formatearHora = (fecha) => {
        return fecha.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className={`mensaje-wrapper ${tipo}`}>
            <div className={`mensaje ${tipo}`}>
                <p>{mensaje.texto}</p>
                <span className="timestamp">{formatearHora(mensaje.timestamp)}</span>
            </div>
        </div>
    );
}

export default ChatMessage;
