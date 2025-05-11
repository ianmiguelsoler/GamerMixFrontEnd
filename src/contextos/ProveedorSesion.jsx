import React, { createContext, useState, useEffect } from "react";
import { supabaseConexion } from "../config/supabase.js";
import { useNavigate } from "react-router-dom";

const contextoSesion = createContext();

const ProveedorSesion = ({ children }) => {
  const navegar = useNavigate();

  const datosSesionInicial = {
    email: "",
    password: "",
    nombre_usuario: "",
  };

  const [datosSesion, setDatosSesion] = useState(datosSesionInicial);
  const [usuario, setUsuario] = useState(null);
  const [errorUsuario, setErrorUsuario] = useState("");
  const [sesionIniciada, setSesionIniciada] = useState(false);

  const actualizarDato = (evento) => {
    const { name, value } = evento.target;
    setDatosSesion((prev) => ({ ...prev, [name]: value }));
  };

  const crearCuenta = async () => {
    try {
      const { email, password, nombre_usuario } = datosSesion;
      const { data, error } = await supabaseConexion.auth.signUp({ email, password });
      if (error) throw error;

      const userId = data.user.id;

      const { error: insertError } = await supabaseConexion
        .from("users")
        .insert([{ id: userId, email, nombre_usuario }]);

      if (insertError) throw insertError;

      setErrorUsuario("");
    } catch (error) {
      setErrorUsuario(error.message);
    }
  };

  const iniciarSesion = async () => {
    try {
      const { email, password } = datosSesion;
      const { error } = await supabaseConexion.auth.signInWithPassword({ email, password });
      if (error) throw error;

      await obtenerUsuario(); // Solo al hacer login o recarga
      return { success: true };
    } catch (error) {
      setErrorUsuario(error.message);
      return { success: false, message: error.message };
    }
  };

  const obtenerUsuario = async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabaseConexion.auth.getSession();
      if (sessionError) throw sessionError;

      const session = sessionData?.session;
      if (!session) return;

      const userId = session.user.id;

      const { data: profileData, error: profileError } = await supabaseConexion
        .from("users")
        .select("nombre_usuario, email, fecha_registro, nivel, experiencia, rol, inhabilitado")
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
    } catch (error) {
      setErrorUsuario(error.message);
      setUsuario(null);
      setSesionIniciada(false);
    }
  };

  const cerrarSesion = async () => {
    try {
      await supabaseConexion.auth.signOut();
      setUsuario(null);
      setSesionIniciada(false);
      setErrorUsuario("");
      navegar("/iniciarsesion");
    } catch (error) {
      setErrorUsuario(error.message);
    }
  };

  // Restaura sesión si ya está iniciada en Supabase al cargar la app
  useEffect(() => {
    obtenerUsuario();
  }, [sesionIniciada]);

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
    <contextoSesion.Provider value={datosAExportar}>
      {children}
    </contextoSesion.Provider>
  );
};

export default ProveedorSesion;
export { contextoSesion };
