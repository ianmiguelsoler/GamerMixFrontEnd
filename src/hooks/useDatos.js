import { useState, useEffect } from 'react';

const useDatos = (url) => {
    const [datos, setDatos] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const respuesta = await fetch(url);
                if (!respuesta.ok) {
                    throw new Error('Error al obtener los datos');
                }
                const resultado = await respuesta.json();
                setDatos(resultado);
            } catch (error) {
                setError(error.message);
            } finally {
                setCargando(false);
            }
        };

        fetchData();
    }, [url]);

    return { datos, cargando, error };
};

export default useDatos;