import React, { createContext } from 'react';
import useDatos from '../hooks/useDatos.js'; 

export const ProveedorSesion = createContext();

const ProveedorSesionProvider = ({ children }) => {
    const { datos: usuarios, cargando, error } = useDatos('http://localhost:8090/api/users');

    return (
        <ProveedorSesion.Provider value={{ usuarios, cargando, error }}>
            {children}
        </ProveedorSesion.Provider>
    );
};

export default ProveedorSesionProvider;
