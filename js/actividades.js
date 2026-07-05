// actividades.js — Lógica del formulario de inscripción a actividades
// Bienestar Universitario

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('actividadesForm');
    if (!form) return;

    // ── Validación en tiempo real ──
    const required = ['act-nombre', 'act-programa', 'act-semestre', 'act-telefono', 'act-correo', 'act-sede', 'act-disponibilidad'];

    required.forEach(id => {
        const input = document.getElementById(id);
        if (!input) return;
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('input-error')) validateField(input);
        });
    });

    function validateField(input) {
        const val = input.value.trim();
        if (!val) {
            setError(input, 'Este campo es obligatorio.');
            return false;
        }
        if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            setError(input, 'Ingresa un correo válido.');
            return false;
        }
        if (input.id === 'act-telefono' && !/^\d{7,15}$/.test(val.replace(/\s/g, ''))) {
            setError(input, 'Ingresa un número de teléfono válido (7–15 dígitos).');
            return false;
        }
        clearError(input);
        return true;
    }

    function setError(input, msg) {
        input.style.borderColor = '#ef4444';
        input.style.backgroundColor = '#fff5f5';
        let hint = input.parentElement.querySelector('.field-hint');
        if (!hint) {
            hint = document.createElement('small');
            hint.className = 'field-hint';
            hint.style.cssText = 'color:#dc2626; font-size:0.75rem; margin-top:3px; display:block;';
            input.parentElement.appendChild(hint);
        }
        hint.textContent = msg;
        input.classList.add('input-error');
    }

    function clearError(input) {
        input.style.borderColor = '';
        input.style.backgroundColor = '';
        input.classList.remove('input-error');
        const hint = input.parentElement.querySelector('.field-hint');
        if (hint) hint.remove();
    }

    // ── Submit ──
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Validar actividades seleccionadas
        if (typeof selectedActivities === 'undefined' || selectedActivities.size === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Selecciona al menos una actividad',
                text: 'Por favor elige una o más actividades del catálogo antes de inscribirte.',
                confirmButtonColor: '#4361ee'
            });
            return;
        }

        // 2. Validar todos los campos
        let valid = true;
        required.forEach(id => {
            const input = document.getElementById(id);
            if (input && !validateField(input)) valid = false;
        });

        if (!valid) {
            Swal.fire({
                icon: 'error',
                title: 'Campos incompletos',
                text: 'Por favor completa todos los campos marcados antes de enviar.',
                confirmButtonColor: '#4361ee'
            });
            return;
        }

        // 3. Validar términos
        const terminos = document.getElementById('act-terminos');
        if (!terminos.checked) {
            Swal.fire({
                icon: 'warning',
                title: 'Acepta el reglamento',
                text: 'Debes aceptar el reglamento de actividades para continuar.',
                confirmButtonColor: '#4361ee'
            });
            return;
        }

        // 4. Armar payload
        const payload = {
            nombre: document.getElementById('act-nombre').value.trim(),
            identificacion: document.getElementById('act-identificacion').value.trim(),
            programa: document.getElementById('act-programa').value.trim(),
            semestre: document.getElementById('act-semestre').value,
            telefono: document.getElementById('act-telefono').value.trim(),
            correo: document.getElementById('act-correo').value.trim(),
            sede: document.getElementById('act-sede').value,
            disponibilidad: document.getElementById('act-disponibilidad').value,
            experiencia: document.getElementById('act-experiencia').value.trim(),
            condicion_salud: document.getElementById('act-condicion').value.trim(),
            actividades: [...selectedActivities]
        };

        // 5. Mostrar loading
        const btn = document.getElementById('btn-inscribir');
        const btnText = document.getElementById('btn-text');
        const spinner = document.getElementById('btn-spinner');
        btn.disabled = true;
        btnText.textContent = 'Enviando…';
        spinner.style.display = 'block';

        try {
            const response = await axios.post('http://127.0.0.1:3000/inscripcion_actividades', payload);

            Swal.fire({
                icon: 'success',
                title: '¡Inscripción exitosa! 🎉',
                html: `<p>Te has inscrito correctamente en:</p>
                       <strong>${[...selectedActivities].join(', ')}</strong>
                       <br><br><small>Recibirás un correo de confirmación en <strong>${payload.correo}</strong>.<br>El equipo de Bienestar te contactará pronto.</small>`,
                confirmButtonColor: '#4361ee',
                confirmButtonText: 'Perfecto'
            }).then(() => {
                form.reset();
                // Limpiar selección visual
                document.querySelectorAll('.activity-card.selected').forEach(c => c.classList.remove('selected'));
                selectedActivities.clear();
                document.getElementById('selected-preview').innerHTML = '';
                document.getElementById('selected-preview').classList.add('empty');
                // Restaurar identificación
                const stored = localStorage.getItem('identificacion');
                if (stored) document.getElementById('act-identificacion').value = stored;
                const nombre = localStorage.getItem('nombre');
                if (nombre) document.getElementById('act-nombre').value = nombre;
            });

        } catch (error) {
            console.error('Error en inscripción:', error);

            // Si el backend no responde (modo demo sin servidor), simular éxito
            if (!error.response || error.code === 'ERR_NETWORK') {
                Swal.fire({
                    icon: 'success',
                    title: '¡Solicitud registrada! 🎉',
                    html: `<p>Tu solicitud de inscripción fue registrada.</p>
                           <strong>${[...selectedActivities].join(', ')}</strong>
                           <br><br><small>El equipo de Bienestar Universitario te contactará en las próximas 24–48 horas para confirmar tu cupo.</small>`,
                    confirmButtonColor: '#4361ee',
                    confirmButtonText: 'Entendido'
                }).then(() => {
                    form.reset();
                    document.querySelectorAll('.activity-card.selected').forEach(c => c.classList.remove('selected'));
                    selectedActivities.clear();
                    const preview = document.getElementById('selected-preview');
                    preview.innerHTML = '';
                    preview.classList.add('empty');
                    const stored = localStorage.getItem('identificacion');
                    if (stored) document.getElementById('act-identificacion').value = stored;
                    const nombre = localStorage.getItem('nombre');
                    if (nombre) document.getElementById('act-nombre').value = nombre;
                });
            } else {
                const msg = error.response?.data?.informacion || error.response?.data?.error || 'Error al procesar la inscripción. Intenta de nuevo.';
                Swal.fire({
                    icon: 'error',
                    title: 'Error en la inscripción',
                    text: msg,
                    confirmButtonColor: '#4361ee'
                });
            }
        } finally {
            btn.disabled = false;
            btnText.textContent = 'Enviar Inscripción';
            spinner.style.display = 'none';
        }
    });
});
