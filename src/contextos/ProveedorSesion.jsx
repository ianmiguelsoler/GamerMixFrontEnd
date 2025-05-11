import React, { createContext, useState, useEffect } from "react";
import { supabaseConexion } from "../config/supabase.js";
import { useNavigate } from "react-router-dom";

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

  // Actualiza los datos de inicio de sesión conforme se escribe en los campos del formulario.
  const actualizarDato = (evento) => {
    const { name, value } = evento.target;
    setDatosSesion({ ...datosSesion, [name]: value });
  };

  const crearCuenta = async () => {
    try {
      const { email, password, nombre_usuario } = datosSesion;
      const { data, error } = await supabaseConexion.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      const userId = data.user.id;

      const { error: insertError } = await supabaseConexion
        .from("users")
        .insert([{ id: userId, nombre_usuario, email }]);

      if (insertError) throw insertError;

      setErrorUsuario(errorUsuarioInicial);
    } catch (error) {
      setErrorUsuario(error.message); // ❗️ Guarda el error para mostrarlo si hace falta
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

      await obtenerUsuario(); // Solo al hacer login o recarga
      setSesionIniciada(true);
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
              "nombre_usuario, email, fecha_registro, nivel, experiencia, rol, inhabilitado"
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
        });

        setSesionIniciada(true);
      }
    } catch (error) {
      setErrorUsuario(error.message); // Guarda el mensaje de error.
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
