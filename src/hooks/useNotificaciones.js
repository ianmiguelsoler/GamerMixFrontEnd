import Swal from 'sweetalert2';

const useNotificaciones = () => {
    const mostrarNotificacion = ({ titulo, mensaje, icono = 'info', tiempo = 3000 }) => {
        Swal.fire({
            title: titulo,
            text: mensaje,
            icon: icono, // 'success', 'error', 'warning', 'info'
            timer: tiempo,
            showConfirmButton: false,
            toast: true,
            position: 'top-end',
        });
    };

    return { mostrarNotificacion };
};

export default useNotificaciones;
