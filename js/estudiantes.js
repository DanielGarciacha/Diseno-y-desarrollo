// Conectado con estudiantes.html
document.addEventListener('DOMContentLoaded', function(){
    const apiUrl = 'http://localhost:3000';
    const identificacion = localStorage.getItem('identificacion');
    const genero = localStorage.getItem('genero');
    const nombre = localStorage.getItem('nombre') || localStorage.getItem('username');

    // Aplicar color según el género (UI Dinámica y Premium)
    function applyGenderTheme() {
        if (!genero) return;
        
        const root = document.documentElement;
        if (genero === 'female') {
            root.style.setProperty('--primary-color', '#ff4081');
            root.style.setProperty('--primary-light', '#fce4ec');
            document.body.style.background = 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)';
        } else if (genero === 'male') {
            root.style.setProperty('--primary-color', '#2196f3');
            root.style.setProperty('--primary-light', '#e3f2fd');
            document.body.style.background = 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)';
        } else {
            root.style.setProperty('--primary-color', '#4caf50');
            root.style.setProperty('--primary-light', '#e8f5e9');
            document.body.style.background = 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)';
        }
    }
    
    function loadUserList(){
        if (!identificacion) {
            console.error('No se encontró identificación del estudiante');
            return;
        }

        axios.get(`${apiUrl}/get_citas_by_id/${identificacion}`)
        .then(response => {
            console.log("Citas Recibidas:", response.data);
            const tableBody = document.querySelector('#estudiantes-table tbody');
            if (!tableBody) return;
            tableBody.innerHTML = '';
            
            if (response.data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5" class="text-center">No tienes citas programadas</td></tr>';
                return;
            }

            // Ordenar por ID_De_Cita numéricamente
            const sortedData = response.data.sort((a, b) => {
                return parseInt(a.ID_De_Cita) - parseInt(b.ID_De_Cita);
            });
            
            sortedData.forEach(cita => {
                const row = document.createElement('tr');
                row.className = 'animate__animated animate__fadeInUp';
                row.innerHTML = `
                  <td>${cita.Nombre_Completo}</td>
                  <td>${cita.ID_De_Cita}</td>
                  <td><span class="badge ${cita.Tipo_Cita === 'Psicologia' ? 'bg-purple' : 'bg-teal'}">${cita.Tipo_Cita}</span></td>
                  <td>${cita.sede}</td>
                  <td>${cita.fecha}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching appointments', error);
        });
    }

    // Cargar también recomendaciones
    function loadRecommendations() {
        if (!identificacion) return;
        
        axios.get(`${apiUrl}/get_recommendations_by_id/${identificacion}`)
        .then(response => {
            console.log("Recomendaciones Recibidas:", response.data);
            // Si hay un contenedor para recomendaciones, llenarlo
            const recContainer = document.getElementById('recommendations-container');
            if (!recContainer) return;
            
            recContainer.innerHTML = '';
            if (response.data.length === 0) {
                recContainer.innerHTML = '<p class="text-muted">No hay recomendaciones registradas.</p>';
                return;
            }

            response.data.forEach(rec => {
                const card = document.createElement('div');
                card.className = 'recommendation-card mb-3 p-3 border rounded shadow-sm bg-white animate__animated animate__fadeInRight';
                card.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h6 class="mb-0 text-primary">${rec.Tipo_Profesional}: ${rec.Nombre_Profesional}</h6>
                        <small class="text-muted">${rec.fecha}</small>
                    </div>
                    <p class="mb-0">${rec.recomendacion}</p>
                    <div class="mt-2 text-end">
                        <span class="badge bg-light text-dark border">${rec.Tipo_Recomendacion}</span>
                    </div>
                `;
                recContainer.appendChild(card);
            });
        })
        .catch(error => console.error('Error fetching recommendations', error));
    }
    
    applyGenderTheme();
    loadUserList();
    loadRecommendations();
});
