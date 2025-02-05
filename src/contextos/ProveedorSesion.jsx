import React, { createContext, useState, useEffect } from "react";
import { supabaseConexion } from "../Config/supabase.js";
import { useNavigate } from "react-router-dom";

// Crear el contexto para la sesión.
const contextoSesion = createContext();

const ProveedorSesion = ({ children }) => {
  // Estado inicial para los datos de inicio de sesión.
  const datosSesionInicial = {
    email: "",
    password: "",
  };

  // Otros estados iniciales.
  const usuarioInicial = null; // Usuario no autenticado.
  const errorUsuarioInicial = ""; // Sin errores al principio.
  const sesionIniciadaInicial = false; // Sesión no iniciada.

  const navegar = useNavigate(); // Hook para redireccionar.

  // Estados del contexto.
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
      const { email, password, username } = datosSesion;
  
      // Registrar al usuario en Supabase Auth.
      const { data, error } = await supabaseConexion.auth.signUp({
        email,
        password,
      });
  
      if (error) throw error;
  
      const userId = data.user.id; // Obtén el ID del usuario recién creado.
  
      // Insertar el usuario en la tabla "users".
      const { error: insertError } = await supabaseConexion
        .from("users")
        .insert([{ id: userId, username, email }]);
  
      if (insertError) throw insertError;
  
      setErrorUsuario(""); // Limpia los errores.
    } catch (error) {
      setErrorUsuario(error.message); // Guarda el mensaje de error.
    }
  };
  
  // Maneja el proceso de inicio de sesión.
  const iniciarSesion = async () => {
    try {
      const { email, password } = datosSesion;
  
      // Llama a la función de Supabase para iniciar sesión.
      const { data, error } = await supabaseConexion.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) throw error;
  
      // Después de iniciar sesión, obtener la información del usuario.
      await obtenerUsuario();
      setSesionIniciada(true); // Marca la sesión como iniciada.
      return { success: true }; // Devuelve resultado exitoso.
    } catch (error) {
      setErrorUsuario(error.message); // Guarda el mensaje de error.
      return { success: false, message: error.message }; // Devuelve resultado fallido.
    }
  };
  
  const obtenerUsuario = async () => {
    try {
      // Obtiene la sesión actual de Supabase.
      const { data: sessionData, error: sessionError } = await supabaseConexion.auth.getSession();
  
      if (sessionError) {
        throw sessionError; // Lanza el error si ocurre.
      }
  
      if (sessionData?.session) {
        const userId = sessionData.session.user.id;
  
        // Obtiene información adicional del perfil del usuario desde la tabla "users".
        const { data: profileData, error: profileError } = await supabaseConexion
          .from("users")
          .select("username, created_at, email")
          .eq("id", userId)
          .single();
  
        if (profileError) throw profileError;
  
        // Almacena los datos del usuario en el estado.
        setUsuario({
          id: userId,
          username: profileData.username,
          createdAt: profileData.created_at,
          email: profileData.email,
        });
  
        setSesionIniciada(true); // Marca la sesión como iniciada.
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
      navegar("/login"); // Redirige a la página de login.
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
