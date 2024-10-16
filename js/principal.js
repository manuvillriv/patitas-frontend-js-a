window.addEventListener('load', function(){

    // referenciar elementos de la pagina
    const msgSuccess = this.document.getElementById('msgSuccess');
    const btnCerrarSesion = this.document.getElementById('btnCerrarSesion');

    // recuperar nombre del usuario del localstorage
    const result = JSON.parse(this.localStorage.getItem('result'));
    mostrarAlerta(`Bienvenido ${result.nombreUsuario}`);

    // Agregamos la accion al boton de cerrar sesión
    btnCerrarSesion.addEventListener('click', function(){
        cerrarSesion()
    });

});

function mostrarAlerta(mensaje) {
    msgSuccess.innerHTML = mensaje;
    msgSuccess.style.display = 'block';
}

function ocultarAlerta() {
    msgSuccess.innerHTML = '';
    msgSuccess.style.display = 'none';
}

async function cerrarSesion() {
    const url = 'http://localhost:8082/login/cerrar-sesion';
    const data = {
        tipoDocumento: localStorage.getItem('tipoDocumento'),
        numeroDocumento: localStorage.getItem('numeroDocumento')
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if(!response.ok) {
            mostrarAlerta('Error: Ocurrió un problema al cerrar sesión');
            throw new Error(`Error: ${response.statusText}`);
        }

        //validar respuesta
        const result = await response.json();
        console.log('Respuesta del servidor: ', result);

        if(result.codigo === '00') {
            localStorage.removeItem('result');
            localStorage.removeItem('tipoDocumento');
            localStorage.removeItem('numeroDocumento');
            window.location.replace('index.html');

        } else {
            mostrarAlerta(result.mensaje);
        }

    } catch (error) {

        console.error('Error: Ocurrió un problema no identificado', error);
        mostrarAlerta('Error: Ocurrió un problema no identificado');

    }
}