import React from "react";
import { motion } from "framer-motion";
import Errores from "../../Errores.jsx";
import { Edit, Delete } from "@mui/icons-material";
import "./GestionUsuarios.css";

const usuariosEjemplo = [
  {
    id: 1,
    nombre_usuario: "MaiCuyita",
    email: "mai@example.com",
    fecha_registro: "2024-05-01T00:00:00Z",
    nivel: 10,
    experiencia: 1450,
  },
  {
    id: 2,
    nombre_usuario: "GamerChan",
    email: "gamerchan@example.com",
    fecha_registro: "2024-05-02T00:00:00Z",
    nivel: 7,
    experiencia: 890,
  },
  {
    id: 3,
    nombre_usuario: "YuyuPower",
    email: "yuyu@example.com",
    fecha_registro: "2024-05-03T00:00:00Z",
    nivel: 3,
    experiencia: 250,
  },
];

const GestionUsuarios = () => {
  const usuarios = usuariosEjemplo;
  const cargando = false;
  const error = null;

  if (cargando) return <p className="loading">Cargando usuarios...</p>;

  return (
    <div className="gestion-usuarios-container">
      <h2 className="title">Gestión de Usuarios</h2>

      {error && <Errores>{error}</Errores>}

      <motion.table
        className="usuarios-table colorful-table"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre de Usuario</th>
            <th>Email</th>
            <th>Fecha de Registro</th>
            <th>Nivel</th>
            <th>Experiencia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user, index) => (
            <motion.tr
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="usuarios-row"
            >
              <td>{user.id}</td>
              <td>{user.nombre_usuario}</td>
              <td>{user.email}</td>
              <td>{new Date(user.fecha_registro).toLocaleDateString()}</td>
              <td>{user.nivel}</td>
              <td>{user.experiencia}</td>
              <td className="acciones">
                <button className="icon-button editar" title="Editar">
                  <Edit />
                </button>
                <button className="icon-button borrar" title="Borrar">
                  <Delete />
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
    </div>
  );
};

export default GestionUsuarios;
