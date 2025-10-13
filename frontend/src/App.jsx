import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import RegistroPaciente from "./pages/RegistroPaciente";
import Consulta from "./pages/Consulta";
import Historial from "./pages/Historial";
import Toast from "./components/Toast";
import "./App.css";

function App() {
  const [toastData, setToastData] = useState({ show: false, msg: "", type: 1 });

  const showToast = (msg, type = 1) => {
    setToastData({ show: true, msg, type });
  };

  return (
    <Router>
      <div className="app-container">
        {/* NAVBAR */}
        <nav className="navbar">
          <h1 className="logo">AI-Vida</h1>
          <div className="nav-links">
            <Link to="/">Inicio</Link>
            <Link to="/registro">Datos de Paciente</Link>
            <Link to="/consulta">Consulta</Link>
            <Link to="/historial">Historial</Link>
          </div>
        </nav>

        {/* CONTENIDO PRINCIPAL */}
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/registro" element={<RegistroPaciente />} />
            <Route path="/consulta" element={<Consulta />} />
            <Route path="/historial" element={<Historial />} />
          </Routes>

          <div style={{ marginTop: "20px" }}>
            <button onClick={() => showToast("Operación completada correctamente.", 1)}>
              Info (Azul)
            </button>
            <button onClick={() => showToast("Revisa los datos ingresados.", 2)}>
              Alerta (Amarillo)
            </button>
            <button onClick={() => showToast("Error crítico detectado.", 3)}>
              Peligro (Rojo)
            </button>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="footer">
          <p>© 2025 AI-Vida | Proyecto de Prevención Médica Inteligente</p>
        </footer>

        {/* TOAST */}
        {toastData.show && (
          <Toast
            title="AI-Vida"
            message={toastData.msg}
            type={toastData.type}
            image="/logo.png" // puedes poner cualquier icono o imagen
            onClose={() => setToastData({ ...toastData, show: false })}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
