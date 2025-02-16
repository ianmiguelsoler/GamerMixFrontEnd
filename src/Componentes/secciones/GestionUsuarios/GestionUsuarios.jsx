import React, { useContext } from "react";
import { ProveedorSesion } from "../../../contextos/ProveedorSesion.jsx";
import { motion } from "framer-motion";
import Errores from "../../Errores.jsx";
import "./GestionUsuarios.css";

const GestionUsuarios = () => {
  const { usuarios, cargando, error } = useContext(ProveedorSesion);

  if (cargando) return <p className="loading">Cargando usuarios...</p>;

  return (
    <>

      <div className="gestion-usuarios-container">
        <h2 className="title">Gestión de Usuarios</h2>

        {/* Muestra el componente Errores si hay un error */}
        {error && <Errores>{error}</Errores>}

        <motion.table
          className="usuarios-table colorful-table"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <thead>
            <tr>
              <th style={{ backgroundColor: "#ff6b6b", color: "#fff" }}>ID</th>
              <th style={{ backgroundColor: "#ffb84d", color: "#fff" }}>
                Nombre de Usuario
              </th>
              <th style={{ backgroundColor: "#1dd1a1", color: "#fff" }}>
                Email
              </th>
              <th style={{ backgroundColor: "#54a0ff", color: "#fff" }}>
                Fecha de Registro
              </th>
              <th style={{ backgroundColor: "#f368e0", color: "#fff" }}>
                Nivel
              </th>
              <th style={{ backgroundColor: "#ff9f43", color: "#fff" }}>
                Experiencia
              </th>
            </tr>
          </thead>
          <tbody>
            {usuarios &&
              usuarios.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="usuarios-row"
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f8f9fa" : "#dfe6e9",
                    color: "#2d3436",
                  }}
                >
                  <td>{user.id}</td>
                  <td>{user.nombre_usuario}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.fecha_registro).toLocaleDateString()}</td>
                  <td>{user.nivel}</td>
                  <td>{user.experiencia}</td>
                </motion.tr>
              ))}
          </tbody>
        </motion.table>
      </div>
    </>
  );
};

export default GestionUsuarios;
