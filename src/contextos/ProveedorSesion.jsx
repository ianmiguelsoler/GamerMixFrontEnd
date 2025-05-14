import React, { createContext, useState, useEffect } from "react";
import { supabaseConexion } from "../config/supabase.js";
import { useNavigate } from "react-router-dom";
import imagenesPredefinidas from "../assets/imagenesPerfilUrls.js";
import { useLocation } from "react-router-dom";

const contextoSesion = createContext();

const ProveedorSesion = ({ children }) => {
  const navegar = useNavigate();
  const location = useLocation();

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
      if (!email || !password || !nombre_usuario)
        return { success: false, error: "missingFields" };

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email))
        return { success: false, error: "invalidEmail" };
      if (password.length < 6) return { success: false, error: "weakPassword" };

      const { data, error } = await supabaseConexion.auth.signUp({
        email,
        password,
      });
      if (error) {
        if (error.message.includes("already"))
          return { success: false, error: "emailAlreadyRegistered" };
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
      setErrorUsuario(error.message);
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
      await obtenerUsuario();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

 const restablecerPassword = async () => {
  // try {
  //   const { email } = datosSesion;
  //   if (!email) {
  //     setErrorUsuario("Debes escribir tu correo para recuperar la contraseña.");
  //     return { success: false };
  //   }

  //   const { error } = await supabaseConexion.auth.resetPasswordForEmail(email, {
  //     redirectTo: "https://ianmiguelsoler.github.io/GamerMixFrontEnd/#/cambiar-password",
  //   });

  //   if (error) throw error;

  //   setErrorUsuario("");
  //   return { success: true };
  // } catch (error) {
  //   setErrorUsuario(error.message);
  //   return { success: false, error: error.message };
  // }
};


const cambiarPassword = async () => {
  try {
    const { password } = datosSesion;

    // Validación personalizada
    if (password.length < 6) {
      return { success: false, error: "weakPassword" };
    }

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

  useEffect(() => {
  limpiarError();
  
  // const suscripcion = supabaseConexion.auth.onAuthStateChange((evento, session) => {
  //   if (session) {
  //     if (location.pathname !== "/cambiar-password") {
  //       navegar("/"); // O la ruta que tú quieras como inicio
  //     }
  //     setSesionIniciada(true);
  //     obtenerUsuario();
  //   } else {
  //     setSesionIniciada(false);
  //     setUsuario(null);
  //   }
  // });

  // Ejecutar también al montar el componente
  obtenerUsuario();

  // Limpieza al desmontar
  // return () => {
  //   if (typeof suscripcion?.data?.subscription?.unsubscribe === "function") {
  //     suscripcion.data.subscription.unsubscribe();
  //   }
  // };
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
    restablecerPassword,
    cambiarPassword,
    limpiarError,
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
