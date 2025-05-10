import React, { createContext, useState, useEffect } from "react";
import { supabaseConexion } from "../config/supabase.js";
import { useNavigate } from "react-router-dom";

const contextoSesion = createContext();

const ProveedorSesion = ({ children }) => {
  const navegar = useNavigate();

  const [datosSesion, setDatosSesion] = useState({
    email: "",
    password: "",
    nombre_usuario: ""
  });

  const [usuario, setUsuario] = useState(null);
  const [errorUsuario, setErrorUsuario] = useState("");
  const [sesionIniciada, setSesionIniciada] = useState(false);

  const actualizarDato = (e) => {
    const { name, value } = e.target;
    setDatosSesion(prev => ({ ...prev, [name]: value }));
  };

  const crearCuenta = async () => {
    try {
      const { email, password, nombre_usuario } = datosSesion;

      // Registro con Supabase Auth
      const { data, error } = await supabaseConexion.auth.signUp({ email, password });
      if (error) throw error;

      const userId = data.user.id;

      // Insertar en la tabla "users"
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

      const { data, error } = await supabaseConexion.auth.signInWithPassword({ email, password });
      if (error) throw error;

      await obtenerUsuario();
      setSesionIniciada(true);
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

      if (sessionData?.session) {
        const userId = sessionData.session.user.id;

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
          inhabilitado: profileData.inhabilitado
        });

        setSesionIniciada(true);
      }
    } catch (error) {
      setErrorUsuario(error.message);
    }
  };

  const cerrarSesion = async () => {
    try {
      await supabaseConexion.auth.signOut();
      setUsuario(null);
      setSesionIniciada(false);
      setErrorUsuario("");
      navegar("/login");
    } catch (error) {
      setErrorUsuario(error.message);
    }
  };

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
