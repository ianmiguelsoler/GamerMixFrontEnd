import React, { createContext, useState, useEffect } from "react";
import { supabaseConexion } from "../config/supabase.js";
import { useNavigate } from "react-router-dom";
import imagenesPredefinidas from "../assets/imagenesPerfilUrls.js";

const contextoSesion = createContext();

const ProveedorSesion = ({ children }) => {
  const navegar = useNavigate();

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

  // Actualiza los datos de inicio de sesión conforme se escribe en los campos del formulario.
  const actualizarDato = (evento) => {
    const { name, value } = evento.target;
    setDatosSesion({ ...datosSesion, [name]: value });
  };

const crearCuenta = async () => {
  try {
    const { email, password, nombre_usuario } = datosSesion;

    if (!email || !password || !nombre_usuario) {
      return { success: false, error: "missingFields" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: "invalidEmail" };
    }

    if (password.length < 6) {
      return { success: false, error: "weakPassword" };
    }

    const { data, error } = await supabaseConexion.auth.signUp({ email, password });

    if (error) {
      if (error.message.includes("already registered") || error.message.includes("already exists")) {
        return { success: false, error: "emailAlreadyRegistered" };
      }
      return { success: false, error: error.message };
    }

    const userId = data.user.id;

    const { error: insertError } = await supabaseConexion
      .from("users")
      .insert([{ id: userId, nombre_usuario, email }]);

    if (insertError) {
      if (insertError.code === "23505" || insertError.message.includes("duplicate key")) {
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

      await obtenerUsuario();
      setSesionIniciada(true);
      navegar("/perfil");
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
        // Obtiene información adicional del perfil del usuario desde la tabla "users".
        const { data: profileData, error: profileError } =
          await supabaseConexion
            .from("users")
            .select(
              "nombre_usuario, email, fecha_registro, nivel, rol, inhabilitado, imagen"
            )
            .eq("id", userId)
            .single();

        if (profileError) throw profileError;

        setUsuario({
          id: userId,
          nombre_usuario: profileData.nombre_usuario,
          email: profileData.email,
          fecha_registro: profileData.fecha_registro,
          nivel: profileData.nivel,
          experiencia: profileData.experiencia,
          rol: profileData.rol,
          inhabilitado: profileData.inhabilitado,
          imagen: profileData.imagen,
        });

        setSesionIniciada(true);
      }
    } catch (error) {
      setErrorUsuario(error.message); // Guarda el mensaje de error.
    }
  };

  const guardarPerfilUsuario = async (id, datosActualizados) => {
    try {
      const { data, error } = await supabaseConexion
        .from("users")
        .update(datosActualizados)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      await obtenerUsuario(); // Refresca el estado del usuario

      return { data, error: null };
    } catch (error) {
      console.error("Error al guardar perfil:", error.message);
      return { data: null, error };
    }
  };

  // Cierra la sesión del usuario.
  const cerrarSesion = async () => {
    try {
      // Llama a la función de Supabase para cerrar sesión.
      await supabaseConexion.auth.signOut();
      setUsuario(usuarioInicial); // Resetea el usuario.
      setSesionIniciada(false); // Marca la sesión como cerrada.
      setErrorUsuario(errorUsuarioInicial); // Limpia los errores.
      navegar("/iniciarsesion"); // Redirige a la página de login.
    } catch (error) {
      setErrorUsuario(error.message); // Guarda el mensaje de error.
    }
  };

  // Restaura la sesión al recargar la página.
  useEffect(() => {
    obtenerUsuario(); // Llama a la función para obtener la sesión y el usuario.
  }, [sesionIniciada]);

  // Datos que se exportarán a través del contexto.
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
  };

  return (
    // Proveedor del contexto que envuelve a los componentes hijos.
    <contextoSesion.Provider value={datosAExportar}>
      {children}
    </contextoSesion.Provider>
  );
};

export default ProveedorSesion;
export { contextoSesion };
