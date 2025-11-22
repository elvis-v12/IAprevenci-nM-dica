import React, { useEffect } from "react";
import "./Toast.css";

const Toast = ({ 
  title = "Notificación", 
  message, 
  type = 1,         
  customImage, 
  duration = 5000,
  onClose 
}) => {

  if (!message) return null;

  // Colores por tipo
  const colorMap = {
    1: "#77B255",
    2: "#facc15",
    3: "#dc2626",
  };

  const iconMap = {
    1: "/src//assets/status-check.svg",
    2: "/src//assets/status-alert.svg",
    3: "/src/assets/status-danger.svg",
  };

  useEffect(() => {
    const timer = setTimeout(() => onClose(), duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  return (
    <div className="toast-container">
      {/* Encabezado */}
      <div
        className="toast-header"
        style={{ backgroundColor: colorMap[type] }}
      >
        <span className="toast-title">{title}</span>
        <button className="toast-close" onClick={onClose}>×</button>
      </div>

      {/* Cuerpo */}
      <div className="toast-body">
        <img
          src={customImage || iconMap[type]}
          alt="icon"
          className="toast-img"
        />
        <p className="toast-text">{message}</p>
      </div>
    </div>
  );
};

export default Toast;
