import React, { createContext, useContext, useEffect, useState } from "react";
import { supabaseConexion } from "../config/supabase";
import { contextoSesion } from "./ProveedorSesion.jsx";

const contextoLogros = createContext();

const ProveedorMezclasLogros = ({ children }) => {
  const { usuario } = useContext(contextoSesion);

  const [logrosUsuario, setLogrosUsuario] = useState([]);
  const [totalLogros, setTotalLogros] = useState(0); // <-- NUEVO
  const [cargandoLogros, setCargandoLogros] = useState(true);
  const [errorLogros, setErrorLogros] = useState(null);

  useEffect(() => {
    const obtenerLogros = async () => {
      try {
        setCargandoLogros(true);

        // Obtener logros del usuario
        let logrosConDetalle = [];
        if (usuario?.id) {
          const { data: dataUsuario, error: errorUsuario } = await supabaseConexion
            .from("logros_usuarios")
            .select(`
              fecha_obtenido,
              logros (
                id,
                nombre_logro,
                descripcion,
                puntos,
                image_url,
                created_at
              )
            `)
            .eq("id_usuario", usuario.id);

          if (errorUsuario) throw errorUsuario;

          logrosConDetalle = dataUsuario.map((registro) => ({
            ...registro.logros,
            fecha_obtenido: registro.fecha_obtenido,
          }));
        }

        // Obtener total de logros disponibles
        const { count, error: errorTotal } = await supabaseConexion
          .from("logros")
          .select("*", { count: "exact", head: true });

        if (errorTotal) throw errorTotal;

        setLogrosUsuario(logrosConDetalle);
        setTotalLogros(count);
      } catch (err) {
        setErrorLogros(err.message);
      } finally {
        setCargandoLogros(false);
      }
    };

    obtenerLogros();
  }, [usuario]);

  const datosAExportar = {
    logrosUsuario,
    totalLogros,
    cargandoLogros,
    errorLogros,
  };

  return (
    <contextoLogros.Provider value={datosAExportar}>
      {children}
    </contextoLogros.Provider>
  );
};

export default ProveedorMezclasLogros;
export { contextoLogros };
