import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import RegistroPaciente from "./pages/RegistroPaciente";
import Consulta from "./pages/Consulta";
import Historial from "./pages/Historial";
import "./App.css";

function App() {
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
        </main>

        {/* FOOTER */}
        <footer className="footer">
          <p>© 2025 AI-Vida | Proyecto de Prevención Médica Inteligente</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
