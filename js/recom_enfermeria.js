document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("recomendacionForm");
    const spinner = document.getElementById("loadingSpinner");
    
    axios.defaults.baseURL = "http://localhost:3000";
    const token = localStorage.getItem('token');
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const idEnfermeroInput = document.getElementById('id_enfermero');
    const idEstudianteInput = document.getElementById('id_estudiante');
    const fechaInput = document.getElementById('fecha_recomendacion');
    
    // 1. ID Enfermero (Sesión)
    const storedId = localStorage.getItem('identificacion');
    if (storedId) {
        idEnfermeroInput.value = storedId;
        idEnfermeroInput.readOnly = true;
    }

    // 2. Datos Contexto
    const atenderId = localStorage.getItem('atender_estudiante_id');
    const atenderFecha = localStorage.getItem('atender_fecha_cita');
    
    if (atenderId) {
        idEstudianteInput.value = atenderId;
        if (atenderFecha) fechaInput.value = atenderFecha;
        
        // Limpiar
        localStorage.removeItem('atender_estudiante_id');
        localStorage.removeItem('atender_estudiante_nombre');
        localStorage.removeItem('atender_fecha_cita');
    }

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        spinner.style.display = "block";

        const payload = {
            id_enfermero: idEnfermeroInput.value,
            id_estudiante: idEstudianteInput.value,
            fecha_recomendacion: fechaInput.value,
            recomendacion: document.getElementById('recomendacion').value
        };

        axios.post('/registrar_recomendacion_ef', payload)
        .then(function (response) {
            Swal.fire({
                title: '¡Guardado!',
                text: response.data.informacion || 'Recomendación médica registrada',
                icon: 'success'
            }).then(() => {
                window.location.href = 'enfermeria.html';
            });
        })
        .catch(function (error) {
            Swal.fire('Error', error.response?.data?.message || 'Error en el registro', 'error');
        })
        .finally(() => spinner.style.display = "none");
    });
});