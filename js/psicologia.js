document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'http://127.0.0.1:3000';

    const table = $('#dataTable').DataTable({
        "ajax": {
            "url": `${apiUrl}/getAll_psi`,
            "dataSrc": ""
        },
        "columns": [
            { "data": "nombre_apellidos" },
            { "data": "correo" },
            { "data": "motivo" },
            { "data": "fecha_reserva" },
            { "data": "hora_reserva" },
            { "data": "sede" },
            { "data": "user_id" },
            { 
                "data": null,
                "orderable": false,
                "render": function(data, type, row) {
                    return `
                        <div style="display: flex; gap: 8px;">
                            <button class="action-btn btn-atender attend-btn" 
                                data-id="${row.user_id}" 
                                data-nombre="${row.nombre_apellidos}"
                                data-fecha="${row.fecha_reserva}">
                                <i class="fas fa-user-check"></i> Atender
                            </button>
                            <button class="action-btn btn-eliminar delete-btn" data-id="${row.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                }
            }
        ],
        "language": { "url": "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json" },
        "responsive": true
    });

    // Acción de Atender
    $('#dataTable').on('click', '.attend-btn', function() {
        const estId = $(this).data('id');
        const estNombre = $(this).data('nombre');
        const fechaCita = $(this).data('fecha');
        
        // Guardar contexto en localStorage para el formulario
        localStorage.setItem('atender_estudiante_id', estId);
        localStorage.setItem('atender_estudiante_nombre', estNombre);
        localStorage.setItem('atender_fecha_cita', fechaCita);
        
        // Redirigir al formulario de recomendaciones
        window.location.href = 'recom_psicologo.html';
    });

    // Acción de Eliminar
    $('#dataTable').on('click', '.delete-btn', function() {
        const citaId = $(this).data('id');
        Swal.fire({
            title: '¿Eliminar cita?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${apiUrl}/delete_psi/${citaId}`)
                    .then(() => {
                        table.ajax.reload(null, false);
                        Swal.fire('Eliminada', '', 'success');
                    });
            }
        });
    });
});