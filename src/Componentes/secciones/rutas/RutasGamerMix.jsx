import React from "react";
import { Routes, Route } from "react-router-dom";
import Inicio from "../paginas/Inicio.jsx";
import Perfil from "../paginas/Perfil.jsx";
import Error from "../paginas/Error.jsx";
import GestionUsuarios from "../GestionUsuarios/GestionUsuarios.jsx";
import CrearCuenta from "../sesion/CrearCuenta.jsx";
import IniciarSesion from "../sesion/IniciarSesion.jsx";

const RutasGamerMix = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/gestionusuarios" element={<GestionUsuarios />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/crearcuenta" element={<CrearCuenta />} />
        <Route path="/iniciarsesion" element={<IniciarSesion />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
};

export default RutasGamerMix;
