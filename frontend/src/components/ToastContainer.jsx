import React from "react";
import Toast from "./Toast";
import "./ToastContainer.css";

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="toast-stack">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          title={toast.title}
          message={toast.message}
          type={toast.type}
          customImage={toast.image}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
