import React from 'react';
import useDatos from '../../../hooks/useDatos.js';
import { motion } from 'framer-motion';
import './GestionUsuarios.css';
const GestionUsuarios = () => {
    const { datos: usuarios, cargando, error } = useDatos('http://localhost:8090/api/users');

    if (cargando) return <p className="loading">Cargando usuarios...</p>;
    if (error) return <p className="error">Error: {error}</p>;

    return (
        <div className="gestion-usuarios-container">
            <h2 className="title">Gestión de Usuarios</h2>
            <motion.table 
                className="usuarios-table"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre de Usuario</th>
                        <th>Email</th>
                        <th>Fecha de Registro</th>
                        <th>Nivel</th>
                        <th>Experiencia</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios && usuarios.map((user, index) => (
                        <motion.tr 
                            key={user.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="usuarios-row"
                        >
                            <td>{user.id}</td>
                            <td>{user.nombre_usuario}</td>
                            <td>{user.email}</td>
                            <td>{new Date(user.fecha_registro).toLocaleDateString()}</td>
                            <td>{user.nivel}</td>
                            <td>{user.experiencia}</td>
                        </motion.tr>
                    ))}
                </tbody>
            </motion.table>
        </div>
    );
};

export default GestionUsuarios;
