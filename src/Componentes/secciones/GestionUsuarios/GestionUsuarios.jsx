import React from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("gestionUsuarios");

  const usuarios = usuariosEjemplo;
  const cargando = false;
  const error = null;

  if (cargando) return <p className="loading">{t("loading")}</p>;

  return (
    <div className="gestion-usuarios-container">
      <h2 className="title">{t("title")}</h2>

      {error && <Errores>{error}</Errores>}

      <motion.table
        className="usuarios-table colorful-table"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <thead>
          <tr>
            <th>{t("table.id")}</th>
            <th>{t("table.username")}</th>
            <th>{t("table.email")}</th>
            <th>{t("table.registrationDate")}</th>
            <th>{t("table.level")}</th>
            <th>{t("table.experience")}</th>
            <th>{t("table.actions")}</th>
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
                <button className="icon-button editar" title={t("edit")}>
                  <Edit />
                </button>
                <button className="icon-button borrar" title={t("delete")}>
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
