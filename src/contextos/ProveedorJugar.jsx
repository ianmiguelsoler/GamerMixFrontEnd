import React, { createContext, useContext, useEffect, useState } from "react";
import { supabaseConexion } from "../config/supabase";
import { contextoSesion } from "./ProveedorSesion";

const contextoJugar = createContext();

const ProveedorJugar = ({ children }) => {
  const { usuario } = useContext(contextoSesion);

  const [galeriaCompleta, setGaleriaCompleta] = useState([]);
  const [galeriaFiltrada, setGaleriaFiltrada] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

// 📌 Función para filtrar
const filtrarGaleria = (filtros) => {
  const resultadosFiltrados = galeriaCompleta.filter((item) => {
    const nombreCoincide = item.nombre_combinacion
      .toLowerCase()
      .includes(filtros.nombre?.toLowerCase() || "");
    const skinCoincide = item.skin?.nombre_skin
      .toLowerCase()
      .includes(filtros.skin?.toLowerCase() || "");
    const idCoincide = item.id
      .toLowerCase()
      .includes(filtros.id?.toLowerCase() || "");
    const descripcionCoincide = item.descripcion
      .toLowerCase()
      .includes(filtros.descripcion?.toLowerCase() || "");

    const desbloqueadaCoincide = filtros.soloDesbloqueadas
      ? item.desbloqueada === true
      : true;

    const avatarCoincide =
      !filtros.avatar || filtros.avatar === item.image_url;

    return (
      nombreCoincide &&
      skinCoincide &&
      idCoincide &&
      descripcionCoincide &&
      desbloqueadaCoincide &&
      avatarCoincide
    );
  });

  setGaleriaFiltrada(resultadosFiltrados);
};


useEffect(() => {
  const obtenerGaleriaConDetalles = async () => {
    try {
      setCargando(true);
      if (!usuario?.id) return;

      // 1. Obtener todas las combinaciones posibles
      const { data: todasCombinaciones, error: errorCombinaciones } = await supabaseConexion
        .from("combinaciones")
        .select(`
          id,
          nombre_combinacion,
          descripcion,
          image_url,
          skins (id, nombre_skin, descripcion, image_url),
          elementos (id, nombre_elemento, descripcion, image_url)
        `);

      if (errorCombinaciones) throw errorCombinaciones;

      // 2. Obtener combinaciones que tiene el usuario
      const { data: desbloqueadas, error: errorGaleria } = await supabaseConexion
        .from("galeria")
        .select("id_combinacion")
        .eq("id_usuario", usuario.id);

      if (errorGaleria) throw errorGaleria;

      const idsDesbloqueadas = desbloqueadas.map((item) => item.id_combinacion);

      // 3. Marcar si están desbloqueadas
      const galeriaConMarcado = todasCombinaciones.map((item) => ({
        ...item,
        skin: item.skins,
        elemento: item.elementos,
        desbloqueada: idsDesbloqueadas.includes(item.id),
      }));

      setGaleriaCompleta(galeriaConMarcado);
      setGaleriaFiltrada(galeriaConMarcado);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  if (usuario?.id) {
    obtenerGaleriaConDetalles();
  }
}, [usuario]);


  const datosAExportar = {
    galeriaCompleta,
    galeriaFiltrada,
    cargando,
    error,
    filtrarGaleria,
  };

  return (
    <contextoJugar.Provider value={datosAExportar}>
      {children}
    </contextoJugar.Provider>
  );
};

export default ProveedorJugar;
export { contextoJugar };
