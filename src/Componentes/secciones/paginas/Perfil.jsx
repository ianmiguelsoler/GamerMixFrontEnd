import React, { useContext, useMemo, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import StarBorder from "../../../bibliotecas/StarBorder.jsx";
import { mostrarModalIdioma } from "../../../bibliotecas/funciones/funciones.js";
import "./Perfil.css";
import DecryptedText from "../../../bibliotecas/DecryptedText.jsx";
import Ballpit from "../../../bibliotecas/Ballpit.jsx";
import EditIcon from "@mui/icons-material/Edit";
import { contextoSesion } from "../../../contextos/ProveedorSesion.jsx";
import imagenPorDefecto from "../../../assets/imagenPorDefecto.png";

const Perfil = () => {
  const navegar = useNavigate();
  const { t } = useTranslation("perfil");
  const { usuario, imagenesDisponibles, guardarPerfilUsuario } =
    useContext(contextoSesion);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [avatarSeleccionado, setAvatarSeleccionado] = useState(null);
  const [imagenCambiada, setImagenCambiada] = useState(false);

  const [modoEdicion, setModoEdicion] = useState({
    nombre_usuario: false,
    email: false,
  });

  const [valoresEditables, setValoresEditables] = useState({
    nombre_usuario: "",
    email: "",
  });

  const imagenAleatoria = useMemo(() => {
    if (!imagenesDisponibles || imagenesDisponibles.length === 0) return null;
    const indice = Math.floor(Math.random() * imagenesDisponibles.length);
    return imagenesDisponibles[indice];
  }, [imagenesDisponibles]);

  useEffect(() => {
    if (usuario) {
      setValoresEditables({
        nombre_usuario: usuario.nombre_usuario,
        email: usuario.email,
      });

      if (!usuario.imagen) {
        const aleatoria = imagenAleatoria;
        setAvatarSeleccionado(aleatoria);
        Swal.fire({
          title: t("chooseAvatarTitle") || "¡Elige tu Avatar!",
          text:
            t("chooseAvatarMessage") ||
            "Aún no has elegido una imagen de perfil. Se te asignará una aleatoriamente hasta que escojas una tú.",
          icon: "info",
          confirmButtonText: "OK",
          timer: 4000,
        });
        
      } else {
        setAvatarSeleccionado(usuario.imagen);
      }
    }
  }, [usuario, imagenAleatoria, t]);

  useEffect(() => {
    if (imagenesDisponibles?.length > 0) {
      imagenesDisponibles.forEach((url) => {
        const img = new Image();
        img.src = url;
      });
    }
  }, [imagenesDisponibles]);

  const manejarCambio = (e) => {
    setValoresEditables({
      ...valoresEditables,
      [e.target.name]: e.target.value,
    });
  };

  const activarEdicion = (campo) => {
    setModoEdicion({ ...modoEdicion, [campo]: true });
  };

  const desactivarEdicion = (campo) => {
    setModoEdicion({ ...modoEdicion, [campo]: false });
  };

  const guardarCambios = async () => {
    const camposActualizados = {};

    if (usuario.nombre_usuario !== valoresEditables.nombre_usuario) {
      camposActualizados.nombre_usuario = valoresEditables.nombre_usuario;
    }

    if (usuario.email !== valoresEditables.email) {
      camposActualizados.email = valoresEditables.email;
    }

    if (imagenCambiada && avatarSeleccionado !== usuario.imagen) {
      camposActualizados.imagen = avatarSeleccionado;
    }

    if (Object.keys(camposActualizados).length === 0) return;

    const resultado = await guardarPerfilUsuario(
      usuario.id,
      camposActualizados
    );

    if (resultado?.error) {
      Swal.fire({
        title: "Error",
        text: "No se pudieron guardar los cambios.",
        icon: "error",
      });
      return;
    }

    Swal.fire({
      title: t("successTitle") || "¡Listo!",
      text: t("savedMessage") || "Tus cambios han sido guardados.",
      icon: "success",
    });

    setModoEdicion({ nombre_usuario: false, email: false });
    setImagenCambiada(false);
  };

  const hayCambios = Object.values(modoEdicion).some(Boolean) || imagenCambiada;

  const mostrarNotificacion = () => {
    Swal.fire({
      title: t("toastTitle"),
      text: t("toastMessage"),
      icon: "info",
      confirmButtonText: "OK",
      showConfirmButton: false,
      timer: 2500,
      position: "top-end",
      toast: true,
    });
  };

  if (!usuario) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-700 text-lg">{t("noAccess")}</p>
      </div>
    );
  }

  return (
    <div className="perfil-container">
      <div className="ballpit-background">
        <Ballpit
          count={200}
          gravity={1.5}
          friction={0.9}
          wallBounce={0.95}
          followCursor={false}
          colors={["#6fa8dc", "#a64dff", "#ff6666", "#f0f0f0", "#0f380f"]}
          ambientColor={0xffffff}
          ambientIntensity={0.8}
          lightIntensity={100}
          minSize={0.3}
          maxSize={0.8}
        />
      </div>

      <div className="perfil-card">
        <div className="perfil-contenido">
          <div className="perfil-avatar">
            <img
              src={avatarSeleccionado || imagenPorDefecto}
              alt={t("title")}
              className="perfil-avatar-img"
            />

            <button
              className="boton-pixel boton-avatar"
              onClick={() => setModalAbierto(true)}
            >
              ✨ {t("chooseAvatar")}
            </button>
          </div>

          <div className="perfil-info">
            <div className="perfil-editable perfil-campo-editable">
              {!modoEdicion.nombre_usuario ? (
                <>
                  <EditIcon
                    className="icono-editar"
                    onClick={() => activarEdicion("nombre_usuario")}
                  />
                  <p className="perfil-titulo pixelated">
                  {valoresEditables.nombre_usuario}
                  </p>
                </>
              ) : (
                <input
                  name="nombre_usuario"
                  value={valoresEditables.nombre_usuario}
                  onChange={manejarCambio}
                  onKeyDown={(e) =>
                    e.key === "Enter" && desactivarEdicion("nombre_usuario")
                  }
                  autoFocus
                  className="input-editar"
                />
              )}
            </div>

            <div className="perfil-editable perfil-campo-editable">
              {!modoEdicion.email ? (
                <>
                  <EditIcon
                    className="icono-editar"
                    onClick={() => activarEdicion("email")}
                  />
                  <span className="perfil-email-container">
                    <span className="perfil-label">{t("email")}: </span>
                    <DecryptedText
                      text={valoresEditables.email}
                      speed={60}
                      maxIterations={10}
                      sequential={true}
                      revealDirection="start"
                      className="perfil-texto"
                      parentClassName="perfil-decrypt-container"
                      encryptedClassName="perfil-encrypted"
                    />
                  </span>
                </>
              ) : (
                <input
                  name="email"
                  value={valoresEditables.email}
                  onChange={manejarCambio}
                  onKeyDown={(e) =>
                    e.key === "Enter" && desactivarEdicion("email")
                  }
                  autoFocus
                  className="input-editar"
                />
              )}
            </div>

            <p>
              <span className="perfil-label">{t("role")}</span>{" "}
              <DecryptedText
                text={usuario.rol || "Usuario"}
                speed={60}
                maxIterations={10}
                sequential={true}
                revealDirection="start"
                className="perfil-texto"
                parentClassName="perfil-decrypt-container"
                encryptedClassName="perfil-encrypted"
              />
            </p>
          </div>
        </div>

        <div className="perfil-detalles">
          <p className="perfil-creacion">
            <span className="perfil-label">{t("creation")}</span>{" "}
            <DecryptedText
              text={new Date(usuario.fecha_registro).toLocaleDateString()}
              speed={50}
              maxIterations={8}
              sequential={true}
              revealDirection="end"
              className="perfil-texto"
              parentClassName="perfil-decrypt-container"
              encryptedClassName="perfil-encrypted"
            />
          </p>

          <p className="perfil-nivel">
            <span className="perfil-label">{t("level")}</span> {usuario.nivel}
          </p>

          <div className="perfil-botones">
            {hayCambios && (
              <StarBorder
                as="button"
                className="boton-pixel boton-guardar"
                color="purple"
                speed="2s"
                onClick={guardarCambios}
              >
                💾 {t("saveChanges") || "Guardar Cambios"}
              </StarBorder>
            )}

            <StarBorder
              as="button"
              className="boton-pixel boton-editar"
              color="cyan"
              speed="2s"
              onClick={mostrarNotificacion}
            >
              {t("editButton")}
            </StarBorder>

            <StarBorder
              as="button"
              className="boton-pixel boton-idioma"
              color="blue"
              speed="2s"
              onClick={mostrarModalIdioma}
            >
              {t("changeLanguageButton")}
            </StarBorder>
          </div>
        </div>
      </div>

      {/* 🌟 Modal de selección de avatar */}
      <div
        className={`modal-overlay ${modalAbierto ? "visible" : "hidden"}`}
        onClick={() => setModalAbierto(false)}
      >
        <div className="modal-avatar" onClick={(e) => e.stopPropagation()}>
          <h2>{t("chooseAvatar")}</h2>
          <div className="galeria-avatars">
            {imagenesDisponibles.map((url, index) => (
              <img
                key={index}
                src={url}
                loading="eager"
                className={`avatar-opcion ${
                  avatarSeleccionado === url ? "seleccionado" : ""
                }`}
                onClick={() => {
                  setAvatarSeleccionado(url);
                  setImagenCambiada(true);
                  setModalAbierto(false);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
