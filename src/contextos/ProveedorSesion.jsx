import React, { createContext, useState, useEffect } from "react";
import { supabaseConexion } from "../config/supabase.js";
import { useNavigate } from "react-router-dom";
import imagenesPredefinidas from "../assets/imagenesPerfilUrls.js";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import usaLogros from "../hooks/usaLogros";

const contextoSesion = createContext();

const ProveedorSesion = ({ children }) => {
  const navegar = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation("login");
const { comprobarLogros } = usaLogros();

  const datosSesionInicial = {
    email: "",
    password: "",
  };

  const usuarioInicial = null;
  const errorUsuarioInicial = "";
  const sesionIniciadaInicial = false;

  const [datosSesion, setDatosSesion] = useState(datosSesionInicial);
  const [usuario, setUsuario] = useState(usuarioInicial);
  const [errorUsuario, setErrorUsuario] = useState(errorUsuarioInicial);
  const [sesionIniciada, setSesionIniciada] = useState(sesionIniciadaInicial);
  const [imagenesDisponibles] = useState(imagenesPredefinidas);

  // 🔹 Añadidos para gestión de usuarios (solo admin)
  const [todosLosUsuarios, setTodosLosUsuarios] = useState([]);
  const [cargandoUsuarios, setCargandoUsuarios] = useState(false);
  const [errorUsuarios, setErrorUsuarios] = useState(null);

  const actualizarDato = (evento) => {
    const { name, value } = evento.target;
    setDatosSesion({ ...datosSesion, [name]: value });
  };

  const crearCuenta = async () => {
    try {
      const { email, password, nombre_usuario } = datosSesion;
      if (!email || !password || !nombre_usuario)
        return { success: false, error: "missingFields" };

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email))
        return { success: false, error: "invalidEmail" };
      if (password.length < 6) return { success: false, error: "weakPassword" };

      const { data, error } = await supabaseConexion.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            "https://ianmiguelsoler.github.io/GamerMixFrontEnd/#/iniciarsesion",
        },
      });

      if (error) {
        if (error.message.includes("already"))
          return { success: false, error: "emailAlreadyRegistered" };
        return { success: false, error: error.message };
      }

      const userId = data.user?.id;
      if (!userId) return { success: true }; // El usuario todavía no ha verificado email

      const { error: insertError } = await supabaseConexion
        .from("users")
        .insert([{ id: userId, nombre_usuario, email }]);

      if (insertError) {
        if (
          insertError.code === "23505" ||
          insertError.message.includes("duplicate key")
        ) {
          return { success: false, error: "emailAlreadyRegistered" };
        }
        return { success: false, error: insertError.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };


  const iniciarSesion = async () => {
    try {
      const { email, password } = datosSesion;
      const { data, error } = await supabaseConexion.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      const { data: sessionData } = await supabaseConexion.auth.getSession();
      const userId = sessionData.session.user.id;
      const { data: profileData, error: profileError } = await supabaseConexion
        .from("users")
        .select("inhabilitado")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;
      if (profileData.inhabilitado) {
        await supabaseConexion.auth.signOut();
        return {
          success: false,
          message: t("accountSuspendedMessage"),
        };
      }
      await obtenerUsuario();
      setSesionIniciada(true);
      navegar("/jugar");
      return { success: true };
    } catch (error) {
      setErrorUsuario(error.message);
      return { success: false, message: error.message };
    }
  };

  const obtenerUsuario = async () => {
    try {
      const { data: sessionData, error: sessionError } =
        await supabaseConexion.auth.getSession();
      if (sessionError) throw sessionError;

      if (sessionData?.session) {
        const userId = sessionData.session.user.id;
        const { data: profileData, error: profileError } =
          await supabaseConexion
            .from("users")
            .select(
              "nombre_usuario, email, fecha_registro, nivel, rol, inhabilitado, imagen"
            )
            .eq("id", userId)
            .single();

        if (profileError) throw profileError;

        const user = {
          id: userId,
          nombre_usuario: profileData.nombre_usuario,
          email: profileData.email,
          fecha_registro: profileData.fecha_registro,
          nivel: profileData.nivel,
          rol: profileData.rol,
          inhabilitado: profileData.inhabilitado,
          imagen: profileData.imagen,
        };

        setUsuario(user);
        setSesionIniciada(true);

        if (user.rol === "admin") {
          await obtenerTodosLosUsuarios();
        }
      }
    } catch (error) {
      setErrorUsuario(error.message);
    }
  };

  const obtenerTodosLosUsuarios = async () => {
    try {
      setCargandoUsuarios(true);
      const { data, error } = await supabaseConexion
        .from("users")
        .select(
          "id, nombre_usuario, email, fecha_registro, nivel, rol, inhabilitado, imagen"
        );

      if (error) throw error;
      setTodosLosUsuarios(data);
    } catch (error) {
      setErrorUsuarios(error.message);
    } finally {
      setCargandoUsuarios(false);
    }
  };

  const inhabilitarUsuario = async (id) => {
    try {
      const { error } = await supabaseConexion
        .from("users")
        .update({ inhabilitado: true })
        .eq("id", id);

      if (error) throw error;
      await obtenerTodosLosUsuarios();
    } catch (error) {
      console.error("Error al inhabilitar usuario:", error.message);
    }
  };

  const habilitarUsuario = async (id) => {
    try {
      const { error } = await supabaseConexion
        .from("users")
        .update({ inhabilitado: false })
        .eq("id", id);

      if (error) throw error;
      await obtenerTodosLosUsuarios();
    } catch (error) {
      console.error("Error al habilitar usuario:", error.message);
    }
  };

const guardarPerfilUsuario = async (id, datosActualizados) => {
  console.log(datosActualizados);
  try {
    const { data, error } = await supabaseConexion
      .from("users")
      .update(datosActualizados)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (datosActualizados.imagen) {
      await comprobarLogros({
        usuarioId: id,
        cambioImagenPerfil: true,
      });
    }

    await obtenerUsuario();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
  const cambiarPassword = async () => {
    try {
      const { password } = datosSesion;
      if (password.length < 6) return { success: false, error: "weakPassword" };
      const { error } = await supabaseConexion.auth.updateUser({ password });
      if (error) throw error;
      return { success: true };
    } catch (error) {
      setErrorUsuario(error.message);
      return { success: false };
    }
  };

  const limpiarError = () => {
    setErrorUsuario("");
  };

  const cerrarSesion = async () => {
    try {
      await supabaseConexion.auth.signOut();
      setUsuario(usuarioInicial);
      setSesionIniciada(false);
      setErrorUsuario(errorUsuarioInicial);
      navegar("/iniciarsesion");
    } catch (error) {
      setErrorUsuario(error.message);
    }
  };

  useEffect(() => {
    limpiarError();
    obtenerUsuario();
  }, [sesionIniciada]);

  const datosAExportar = {
    datosSesion,
    errorUsuario,
    usuario,
    sesionIniciada,
    imagenesDisponibles,
    guardarPerfilUsuario,
    cerrarSesion,
    actualizarDato,
    crearCuenta,
    iniciarSesion,
    cambiarPassword,
    limpiarError,
    todosLosUsuarios,
    cargandoUsuarios,
    errorUsuarios,
    inhabilitarUsuario,
    habilitarUsuario,
  };

  return (
    <contextoSesion.Provider value={datosAExportar}>
      {children}
    </contextoSesion.Provider>
  );
};

export default ProveedorSesion;
export { contextoSesion };
