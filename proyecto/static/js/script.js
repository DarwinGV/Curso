document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form');
    const nombre = document.getElementById('nombre_completo');
    const email = document.getElementById('email');
    const mensaje = document.getElementById('Mensaje');
    const femenino = document.getElementById('id_femenino');
    const masculino = document.getElementById('id_masculino');
    const otro = document.getElementById('id_otro');
    const terminos = document.getElementById('TyC');
    const warnings = document.getElementById('warnings');

    form.addEventListener('submit', function (event) {
        let errores = [];
        if (nombre.value.length<6) {
            errores.push('Por favor ingresa tu nombre completo.');
        }

        if (email.value === '') {
            errores.push('Por favor ingresa tu correo electrónico.');
        } else if (!isValidEmail(email.value)) {
            errores.push('Por favor ingresa un correo electrónico válido.');
        }

        if (mensaje.value.length<20) {
            errores.push('Por favor ingresa tu mensaje, minimo 20 caracteres');
        }

        if (!femenino.checked && !masculino.checked && !otro.checked) {
            errores.push('Por favor selecciona tu género.');
        }

        if (!terminos.checked) {
            errores.push('Debes aceptar los términos y condiciones.');
        }

        if (errores.length > 0) {
            event.preventDefault();
            warnings.innerHTML = errores.join('<br>');
        }
    });

    function isValidEmail(email) {
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,7})+$/; 
        return emailRegex.test(email);
    }
});




