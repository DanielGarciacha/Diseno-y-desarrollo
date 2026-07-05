document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'http://localhost:3000';
    const token = localStorage.getItem('token'); // Usamos 'token' como en usuario.js
    
    // Configuración global de Axios
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.defaults.headers.common['Content-Type'] = 'application/json';

    // Función para mostrar alertas con SweetAlert2
    function showAlert(message, type = 'success') {
        Swal.fire({
            title: type === 'success' ? '¡Éxito!' : 'Aviso',
            text: message,
            icon: type,
            confirmButtonColor: '#3b82f6',
            timer: 3000,
            timerProgressBar: true
        });
    }

    // Función para contar usuarios
    async function updateUserCount() {
        try {
            const response = await axios.get(`${apiUrl}/getAll`);
            const countElement = document.getElementById('userCount');
            if (countElement) countElement.textContent = response.data.length;
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
        }
    }

    // Función para contar citas
    async function updateAppointmentCount() {
        try {
            const response = await axios.get(`${apiUrl}/estadisticas_citas`);
            const totalElement = document.getElementById('totalCitas');
            if (totalElement && response.data && response.data.success) {
                const total = (response.data.total_psicologia || 0) + (response.data.total_enfermeria || 0);
                totalElement.textContent = total;
            }
        } catch (error) {
            console.error('Error al obtener citas:', error);
        }
    }

    // Función para cargar usuarios en la tabla
    async function loadUserList() {
        try {
            const response = await axios.get(`${apiUrl}/getAll`);
            const tableBody = document.querySelector('#dataTable tbody');
            if (!tableBody) return;
            
            tableBody.innerHTML = '';
            
            response.data.forEach(user => {
                const row = document.createElement('tr');
                row.className = 'animate__animated animate__fadeIn';
                
                const roleBadges = {
                    'admin': 'background: #dbeafe; color: #1e40af;',
                    'estudiante': 'background: #fef9c3; color: #854d0e;',
                    'psicologo': 'background: #f3e8ff; color: #6b21a8;',
                    'enfermeria': 'background: #dcfce7; color: #166534;'
                };
                
                const badgeStyle = roleBadges[user.rol] || 'background: #f1f5f9; color: #475569;';
                
                row.innerHTML = `
                    <td><strong>#${user.id}</strong></td>
                    <td>${user.nombre}</td>
                    <td>${user.identificacion}</td>
                    <td><small>${user.correo}</small></td>
                    <td>${user.telefono}</td>
                    <td><code>${user.username}</code></td>
                    <td><span style="padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; ${badgeStyle}">${user.rol}</span></td>
                    <td>
                        <div class="action-btns" style="display: flex; gap: 8px;">
                            <button class="btn-icon btn-edit" onclick="editUser(${user.id})" style="background: #dbeafe; color: #2563eb; border:none; border-radius:8px; width:32px; height:32px; cursor:pointer;" title="Editar"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon btn-delete" onclick="deleteUser(${user.id})" style="background: #fee2e2; color: #dc2626; border:none; border-radius:8px; width:32px; height:32px; cursor:pointer;" title="Eliminar"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
        }
    }

    // Agregar nuevo usuario
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            try {
                const formData = new FormData(userForm);
                const userData = Object.fromEntries(formData.entries());
                
                await axios.post(`${apiUrl}/add_contact`, userData);
                showAlert('Usuario creado exitosamente');
                loadUserList();
                updateUserCount();
                userForm.reset();
            } catch (error) {
                console.error('Error al crear usuario:', error);
                showAlert('Error al crear usuario', 'error');
            }
        });
    }

    // Cargar datos para editar
    window.editUser = async function(userId) {
        try {
            const response = await axios.get(`${apiUrl}/getAllById/${userId}`);
            const user = response.data[0];
            if (!user) return;
            
            document.getElementById('updateId').value = user.id;
            document.getElementById('updateNombre').value = user.nombre;
            document.getElementById('updateIdentificacion').value = user.identificacion;
            document.getElementById('updateCorreo').value = user.correo;
            document.getElementById('updateTelefono').value = user.telefono || '';
            document.getElementById('updateUsername').value = user.username;
            
            // El rol es un select ahora
            const roleSelect = document.getElementById('updateRol');
            if (roleSelect) roleSelect.value = user.rol;
            
            // Cambiar a la pestaña de editar
            const editTabBtn = document.querySelector('[data-tab="updateUser"]');
            if (editTabBtn) editTabBtn.click();
            
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'info',
                title: 'Datos cargados en la pestaña de edición',
                showConfirmButton: false,
                timer: 3000
            });
        } catch (error) {
            console.error('Error al cargar usuario:', error);
        }
    };

    // Actualizar usuario
    const updateForm = document.getElementById('updateForm');
    if (updateForm) {
        updateForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            try {
                const formData = new FormData(updateForm);
                const userId = formData.get('id');
                const userData = Object.fromEntries(formData.entries());
                
                // Limpiar campos vacíos para no sobreescribir con nada
                Object.keys(userData).forEach(key => {
                    if (userData[key] === "" && key !== 'id') delete userData[key];
                });

                await axios.put(`${apiUrl}/update/${userId}`, userData);
                showAlert('Usuario actualizado con éxito');
                loadUserList();
                document.querySelector('[data-tab="userList"]').click();
            } catch (error) {
                console.error('Error al actualizar:', error);
                showAlert('Error al actualizar usuario', 'error');
            }
        });
    }

    // Eliminar usuario
    window.deleteUser = async function(userId) {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${apiUrl}/delete/${userId}`);
                showAlert('Usuario eliminado');
                loadUserList();
                updateUserCount();
            } catch (error) {
                console.error('Error al eliminar:', error);
                showAlert('No se pudo eliminar el usuario', 'error');
            }
        }
    };

    // Inicialización
    updateUserCount();
    updateAppointmentCount();
    loadUserList();
    
    // Auto-update cada 2 minutos
    setInterval(() => {
        updateUserCount();
        updateAppointmentCount();
    }, 120000);
});