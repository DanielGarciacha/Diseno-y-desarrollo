document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("recomendacionPsicologiaForm");
    const spinner = document.getElementById("loadingSpinner");
    
    // Configuración de Axios
    axios.defaults.baseURL = "http://localhost:3000";
    const token = localStorage.getItem('token');
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Auto-completar datos desde el contexto de "Atender"
    const idPsicologoInput = document.getElementById('id_psicologo');
    const idEstudianteInput = document.getElementById('id_estudiante');
    const fechaInput = document.getElementById('fecha_recomendacion');
    
    // 1. ID Psicólogo (Sesión)
    const storedId = localStorage.getItem('identificacion');
    if (storedId) {
        idPsicologoInput.value = storedId;
        idPsicologoInput.readOnly = true;
    }

    // 2. Datos de la cita (si viene de "Atender")
    const atenderId = localStorage.getItem('atender_estudiante_id');
    const atenderFecha = localStorage.getItem('atender_fecha_cita');
    
    if (atenderId) {
        idEstudianteInput.value = atenderId;
        if (atenderFecha) fechaInput.value = atenderFecha;
        
        // Limpiar para la próxima
        localStorage.removeItem('atender_estudiante_id');
        localStorage.removeItem('atender_estudiante_nombre');
        localStorage.removeItem('atender_fecha_cita');
    }

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        spinner.style.display = "block";

        const payload = {
            id_psicologo: idPsicologoInput.value,
            id_estudiante: idEstudianteInput.value,
            fecha_recomendacion: fechaInput.value,
            recomendacion: document.getElementById('recomendacion').value
        };

        axios.post('/registrar_recomendacion_ps', payload)
        .then(function (response) {
            Swal.fire({
                title: '¡Registrado!',
                text: response.data.informacion || 'Recomendación guardada con éxito',
                icon: 'success'
            }).then(() => {
                window.location.href = 'psicologos.html';
            });
        })
        .catch(function (error) {
            Swal.fire('Error', error.response?.data?.message || 'No se pudo registrar', 'error');
        })
        .finally(() => spinner.style.display = "none");
    });
});