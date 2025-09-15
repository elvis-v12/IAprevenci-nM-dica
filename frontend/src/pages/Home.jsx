import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <h2>Bienvenido a AI-Vida</h2>
      <p>Un sistema de prevención médica inteligente para estudiantes.</p>

      <div className="sections">
        <div className="card">
          <h3>📝 Registro</h3>
          <p>Completa tus datos médicos para un mejor análisis.</p>
        </div>
        <div className="card">
          <h3>🤖 Consulta</h3>
          <p>Habla con nuestro chatbot para conocer tu estado de salud.</p>
        </div>
        <div className="card">
          <h3>📊 Historial</h3>
          <p>Accede a tu historial médico y genera reportes en PDF.</p>
        </div>
      </div>
    </div>
  );
}
