// formpsi.js - Adaptado para Psicología
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('PSIFORM');
    const responseDiv = document.createElement('div');
    responseDiv.id = 'response';
    responseDiv.className = 'mt-3';
    form.parentNode.insertBefore(responseDiv, form.nextSibling);
    
    // Auto-completar identificación desde localStorage
    const identInput = document.getElementById('identificacion');
    const storedIdent = localStorage.getItem('identificacion');
    if (storedIdent && identInput) {
        identInput.value = storedIdent;
        // Opcionalmente podemos deshabilitarlo para que el estudiante no lo cambie
        // identInput.readOnly = true; 
    }

    function showMessage(message, isError = false) {
        if (isError) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: message,
                confirmButtonColor: '#8b5cf6'
            });
        } else {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: message,
                showConfirmButton: false,
                timer: 2000
            });
        }
        
        responseDiv.innerHTML = `
            <div class="alert alert-${isError ? 'danger' : 'success'} animate__animated animate__fadeIn">
                <strong>${isError ? 'Error:' : 'Éxito:'}</strong> ${message}
            </div>
        `;
        
        setTimeout(() => {
            responseDiv.innerHTML = '';
        }, 5000);
    }

    function updateHoras() {
        const fecha = document.getElementById('rc').value;
        const sede = document.getElementById('AR') ? document.getElementById('AR').value : '';
        const horaSelect = document.getElementById('hora');
        
        if (!fecha || !sede || !horaSelect) return;

        axios.get(`http://127.0.0.1:3000/disponibilidad?fecha=${fecha}&sede=${sede}`)
            .then(response => {
                const horas = response.data.horas_disponibles || [];
                horaSelect.innerHTML = '<option value="" disabled selected>Seleccione hora</option>';
                if (horas.length === 0) {
                    horaSelect.innerHTML = '<option value="" disabled selected>Sin turnos disponibles</option>';
                } else {
                    horas.forEach(h => {
                        const [horaStr, minStr] = h.split(':');
                        let hInt = parseInt(horaStr);
                        const ampm = hInt >= 12 ? 'PM' : 'AM';
                        hInt = hInt % 12;
                        if (hInt === 0) hInt = 12;
                        const hFormat = hInt.toString().padStart(2, '0');
                        const displayTime = `${hFormat}:${minStr} ${ampm}`;

                        const opt = document.createElement('option');
                        opt.value = h.substring(0, 5);
                        opt.textContent = displayTime;
                        horaSelect.appendChild(opt);
                    });
                }
            })
            .catch(err => console.error('Error fetching disponibilidad:', err));
    }

    document.getElementById('rc').addEventListener('change', function() {
        const selectedDate = new Date(this.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showMessage('No puede seleccionar una fecha pasada', true);
            this.value = '';
            return;
        }
        updateHoras();
    });

    const sedeSelect = document.getElementById('AR');
    if (sedeSelect) {
        sedeSelect.addEventListener('change', updateHoras);
    }

    if (identInput) {
        identInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Procesando...
        `;
        submitBtn.disabled = true;
        
        const formData = {
            motivo: document.getElementById('MC').value.trim(),
            fecha: document.getElementById('rc').value,
            hora: document.getElementById('hora').value,
            sede: document.getElementById('AR').value,
            identificacion: document.getElementById('identificacion').value.trim()
        };

        if (!formData.motivo || !formData.fecha || !formData.hora || !formData.sede || !formData.identificacion) {
            showMessage('Todos los campos son obligatorios', true);
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            return;
        }

        axios.post('http://127.0.0.1:3000/citas', formData)
            .then(response => {
                showMessage('¡Cita psicológica registrada exitosamente!');
                form.reset();
                if (storedIdent) identInput.value = storedIdent; // Re-poner la identificación
                document.getElementById('hora').value = '';
            })
            .catch(error => {
                console.error('Error:', error);
                let errorMessage = 'Error al registrar la cita psicológica';
                if (error.response && error.response.data && error.response.data.informacion) {
                    errorMessage = error.response.data.informacion;
                }
                showMessage(errorMessage, true);
            })
            .finally(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
    });
});