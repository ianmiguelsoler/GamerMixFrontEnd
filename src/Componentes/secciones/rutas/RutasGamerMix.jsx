import React from "react";
import { Routes, Route } from "react-router-dom";
import Inicio from "../paginas/Inicio.jsx";
import Perfil from "../paginas/Perfil.jsx";
import Login from "../paginas/Login.jsx";
import Error from "../paginas/Error.jsx";


const RutasUT06 = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
};

export default RutasUT06;
