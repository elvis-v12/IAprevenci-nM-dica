import React, { useState } from "react";
import "./RegistroPaciente.css";

export default function RegistroPaciente() {
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    sexo: "",
    edad: "",
    altura: "",
    peso: "",
    antecedentes: "",
    estiloVida: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos guardados:", form);
  };

  return (
    <div className="page-container">
      <div className="registro-container">
        <h2>Datos de Paciente</h2>
        <form onSubmit={handleSubmit} className="registro-form">
          <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} />
          <input type="text" name="apellidos" placeholder="Apellidos" onChange={handleChange} />
          <select name="sexo" onChange={handleChange}>
            <option value="">Sexo</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
          <input type="number" name="edad" placeholder="Edad" onChange={handleChange} />
          <input type="text" name="altura" placeholder="Altura (cm)" onChange={handleChange} />
          <input type="text" name="peso" placeholder="Peso (kg)" onChange={handleChange} />
          <textarea name="antecedentes" placeholder="Antecedentes médicos" onChange={handleChange}></textarea>
          <textarea name="estiloVida" placeholder="Estilo de vida" onChange={handleChange}></textarea>
          <button type="submit">Guardar datos</button>
        </form>
      </div>
    </div>
  );
}
