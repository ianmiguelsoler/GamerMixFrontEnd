import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { contextoSesion } from "../../../contextos/ProveedorSesion.jsx";
import Errores from "../../Errores.jsx";
import { Edit, Delete, Restore } from "@mui/icons-material";
import "./GestionUsuarios.css";

const GestionUsuarios = () => {
  const { t } = useTranslation("gestionUsuarios");
  const {
    usuario,
    todosLosUsuarios,
    cargandoUsuarios,
    errorUsuarios,
    inhabilitarUsuario,
    habilitarUsuario,
  } = useContext(contextoSesion);

  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroRol, setFiltroRol] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [actualizando, setActualizando] = useState(false);

  if (!usuario || usuario.rol !== "admin") {
    return <p className="no-access">{t("noAccess")}</p>;
  }

  if (cargandoUsuarios) {
    return <p className="loading">{t("loading")}</p>;
  }

  const handleInhabilitar = async (id) => {
    setActualizando(true);
    await inhabilitarUsuario(id);
    setActualizando(false);
  };

  const handleHabilitar = async (id) => {
    setActualizando(true);
    await habilitarUsuario(id);
    setActualizando(false);
  };

  const limpiarFiltros = () => {
    setFiltroNombre("");
    setFiltroRol("");
    setFiltroEstado("");
  };

  const usuariosFiltrados = todosLosUsuarios
    .filter((user) => {
      const nombreOk = user.nombre_usuario.toLowerCase().includes(filtroNombre.toLowerCase());
      const rolOk = filtroRol === "" || user.rol === filtroRol;
      const estadoOk =
        filtroEstado === "" ||
        (filtroEstado === "habilitado" && !user.inhabilitado) ||
        (filtroEstado === "inhabilitado" && user.inhabilitado);
      return nombreOk && rolOk && estadoOk;
    })
    .sort((a, b) => a.inhabilitado - b.inhabilitado);

  return (
    <div className="gestion-usuarios-container">
      <h2 className="title">{t("title")}</h2>

      <div className="filtros-contenedor">
        <label className="filtro-label">
          {t("filters.name")}
          <input
            type="text"
            placeholder={t("filterPlaceholder")}
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
            className="filtro-usuarios"
          />
        </label>

        <label className="filtro-label">
          {t("filters.role")}
          <select
            value={filtroRol}
            onChange={(e) => setFiltroRol(e.target.value)}
            className="filtro-select"
          >
            <option value="">{t("allRoles")}</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <label className="filtro-label">
          {t("filters.status")}
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="filtro-select"
          >
            <option value="">{t("filters.all")}</option>
            <option value="habilitado">{t("no")}</option>
            <option value="inhabilitado">{t("yes")}</option>
          </select>
        </label>

        <button className="btn-limpiar-filtros" onClick={limpiarFiltros}>
          ✨ {t("clearFilters") || "Clear filters"}
        </button>
      </div>

      {errorUsuarios && <Errores>{errorUsuarios}</Errores>}

      <motion.table
        className="usuarios-table colorful-table"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <thead>
          <tr>
            <th>{t("table.username")}</th>
            <th>{t("table.email")}</th>
            <th>{t("table.registrationDate")}</th>
            <th>{t("table.level")}</th>
            <th>{t("table.role")}</th>
            <th>{t("table.disabled")}</th>
            <th>{t("table.avatar")}</th>
            <th>{t("table.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.map((user, index) => (
            <motion.tr
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="usuarios-row"
            >
              <td>{user.nombre_usuario}</td>
              <td>{user.email}</td>
              <td>{new Date(user.fecha_registro).toLocaleDateString()}</td>
              <td>{user.nivel}</td>
              <td>{user.rol}</td>
              <td>{user.inhabilitado ? t("yes") : t("no")}</td>
              <td>
                <img src={user.imagen} alt="avatar" className="avatar-preview" />
              </td>
              <td className="acciones">
                <button className="icon-button editar" title={t("edit")}><Edit /></button>
                {user.inhabilitado ? (
                  <button
                    className="icon-button restaurar"
                    title={t("restore")}
                    onClick={() => handleHabilitar(user.id)}
                    disabled={actualizando}
                  >
                    <Restore />
                  </button>
                ) : (
                  <button
                    className="icon-button borrar"
                    title={t("delete")}
                    onClick={() => handleInhabilitar(user.id)}
                    disabled={actualizando}
                  >
                    <Delete />
                  </button>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
    </div>
  );
};

export default GestionUsuarios;