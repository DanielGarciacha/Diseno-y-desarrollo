document.addEventListener('DOMContentLoaded', function() {
    const downloadCitasBtn = document.getElementById('downloadCitasBtn');
    const downloadRecsBtn = document.getElementById('downloadRecsBtn');
    
    function downloadReport(endpoint, filename, typeName) {
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'info',
            title: `Descargando reporte de ${typeName}...`,
            showConfirmButton: false,
            timer: 2000
        });
        
        axios.get(`http://127.0.0.1:3000${endpoint}`, {
            responseType: 'blob',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        })
        .then(function(response) {
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: `Reporte de ${typeName} descargado`,
                showConfirmButton: false,
                timer: 3000
            });
        })
        .catch(function(error) {
            console.error('Error:', error);
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: `Error al descargar el reporte de ${typeName}`,
                showConfirmButton: false,
                timer: 3000
            });
        });
    }

    if (downloadCitasBtn) {
        downloadCitasBtn.addEventListener('click', function(e) {
            e.preventDefault();
            downloadReport('/exportar_reporte_citas', 'reporte_citas.xlsx', 'citas');
        });
    }

    if (downloadRecsBtn) {
        downloadRecsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            downloadReport('/exportar_reporte_recomendaciones', 'reporte_recomendaciones.xlsx', 'recomendaciones');
        });
    }
});