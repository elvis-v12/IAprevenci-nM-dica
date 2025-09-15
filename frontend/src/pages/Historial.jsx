function Historial() {
  // Por ahora es estático, después conectamos con el backend/DB
  const historial = [
    { id: 1, problema: "Fiebre", recomendacion: "Descanso y líquidos", seguimiento: "Revisar en 3 días" },
    { id: 2, problema: "Dolor de cabeza", recomendacion: "Analgésico simple", seguimiento: "Si persiste, consulta médica" },
  ];

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>Historial</h2>
      {historial.map((h) => (
        <div key={h.id} style={{ border: "1px solid #ddd", margin: "10px", padding: "10px" }}>
          <p><b>Problema:</b> {h.problema}</p>
          <p><b>Recomendación:</b> {h.recomendacion}</p>
          <p><b>Seguimiento:</b> {h.seguimiento}</p>
        </div>
      ))}
      <button>📄 Descargar PDF</button>
    </div>
  );
}

export default Historial;
