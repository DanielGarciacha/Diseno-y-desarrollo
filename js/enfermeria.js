document.addEventListener('DOMContentLoaded', function(){
    const apiUrl = 'http://127.0.0.1:3000';

    const table = $('#dataTable').DataTable({
        "language": { "url": "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json" },
        "responsive": true
    });

    function loadUserList() {
        axios.get(`${apiUrl}/getAll_enfer`)
            .then(response => {
                table.clear();
                response.data.forEach(user => {
                    table.row.add([
                        user.nombre_apellidos,
                        user.correo,
                        user.motivo,
                        user.fecha_reserva,
                        user.hora_reserva,
                        user.sede,
                        user.user_id,
                        `
                        <div style="display: flex; gap: 8px;">
                            <button class="action-btn btn-atender attend-btn" 
                                data-id="${user.user_id}" 
                                data-nombre="${user.nombre_apellidos}"
                                data-fecha="${user.fecha_reserva}">
                                <i class="fas fa-notes-medical"></i> Atender
                            </button>
                            <button class="action-btn btn-eliminar delete-btn" data-id="${user.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>`
                    ]);
                });
                table.draw();
            })
            .catch(error => console.error('Error:', error));
    }

    // Acción Atender
    $('#dataTable').on('click', '.attend-btn', function() {
        localStorage.setItem('atender_estudiante_id', $(this).data('id'));
        localStorage.setItem('atender_estudiante_nombre', $(this).data('nombre'));
        localStorage.setItem('atender_fecha_cita', $(this).data('fecha'));
        window.location.href = 'recom_enfermeria.html';
    });

    // Acción Eliminar
    $('#dataTable').on('click', '.delete-btn', function() {
        const citaId = $(this).data('id');
        Swal.fire({
            title: '¿Eliminar cita?',
            icon: 'warning',
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${apiUrl}/delete_enfer/${citaId}`)
                    .then(() => {
                        loadUserList();
                        Swal.fire('Eliminada', '', 'success');
                    });
            }
        });
    });

    loadUserList();
});