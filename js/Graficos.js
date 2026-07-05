const mostrarGraficos = async () => {
    try {
        const apiUrl = "http://127.0.0.1:3000";
        
        // Configuración de colores profesional y sobria (neutral con acentos)
        const neutralPalette = [
            '#475569', // Slate 600
            '#64748b', // Slate 500
            '#94a3b8', // Slate 400
            '#cbd5e1'  // Slate 300
        ];

        // 1. Gráfico de Usuarios
        const resUsers = await axios.get(`${apiUrl}/getAllUsers`);
        const roles = { admin: 0, estudiante: 0, enfermeria: 0, psicologo: 0, actividades: 0 };
        
        resUsers.data.forEach(u => {
            const r = u.rol.toLowerCase();
            if (roles.hasOwnProperty(r)) roles[r]++;
        });

        const ctxUsers = document.getElementById("myChart").getContext("2d");
        new Chart(ctxUsers, {
            type: "bar",
            data: {
                labels: ['Admins', 'Estudiantes', 'Enfermería', 'Psicología', 'Actividades'],
                datasets: [{
                    label: 'Usuarios Registrados',
                    data: [roles.admin, roles.estudiante, roles.enfermeria, roles.psicologo, roles.actividades],
                    backgroundColor: ['#475569', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0'],
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Distribución de Usuarios por Rol', font: { size: 16, weight: 'bold' } }
                },
                scales: {
                    y: { beginAtZero: true, grid: { display: false } },
                    x: { grid: { display: false } }
                }
            }
        });

        // 2. Gráfico de Citas
        const resStats = await axios.get(`${apiUrl}/estadisticas_citas`);
        const stats = resStats.data;

        const ctxCombined = document.getElementById("combinedChart").getContext('2d');
        new Chart(ctxCombined, {
            type: 'doughnut',
            data: {
                labels: ['Psicología', 'Enfermería'],
                datasets: [{
                    data: [stats.total_psicologia || 0, stats.total_enfermeria || 0],
                    backgroundColor: ['#1e293b', '#64748b'],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: { position: 'bottom' },
                    title: { display: true, text: 'Resumen de Citas Pendientes', font: { size: 16, weight: 'bold' } }
                }
            }
        });

    } catch (error) {
        console.error("Error cargando gráficos:", error);
    }
};

document.addEventListener("DOMContentLoaded", mostrarGraficos);