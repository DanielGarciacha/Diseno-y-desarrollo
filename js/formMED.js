// formMED.js
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('ENFERFORM');
    const responseDiv = document.getElementById('response');
    
    // Auto-completar identificación desde localStorage
    const identInput = document.getElementById('identificacion');
    const storedIdent = localStorage.getItem('identificacion');
    if (storedIdent && identInput) {
        identInput.value = storedIdent;
    }

    function showMessage(message, isError = false) {
        if (isError) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: message,
                confirmButtonColor: '#00b09b'
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

    document.getElementById('rc').addEventListener('change', function() {
        const selectedDate = new Date(this.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showMessage('No puede seleccionar una fecha pasada', true);
            this.value = '';
            return;
        }
    });

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
            motivo: document.getElementById('sintomas').value.trim(),
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

        axios.post('http://127.0.0.1:3000/citas_enfermeria', formData)
            .then(response => {
                showMessage('¡Cita de enfermería registrada exitosamente!');
                form.reset();
                if (storedIdent) identInput.value = storedIdent;
                document.getElementById('hora').value = '';
            })
            .catch(error => {
                console.error('Error:', error);
                let errorMessage = 'Error al registrar la cita';
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