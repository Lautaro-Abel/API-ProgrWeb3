import { validateCuil, sanitizeText } from './security.js';

document.getElementById('recoveryForm').addEventListener('submit', async function (e) {

    e.preventDefault();

    const cuil = document.getElementById('recoveryCuil').value.trim();
    const errorEl = document.getElementById('recoveryError');
    const successEl = document.getElementById('recoverySuccess');

    if (!cuil) {
        errorEl.textContent = 'Por favor ingresá tu CUIL.';
        errorEl.classList.remove('hidden');
        return;
    } else if (!validateCuil(cuil)) {
        errorEl.textContent = 'Datos inválidos.';
        errorEl.classList.remove('hidden');
        return;
    }

    errorEl.classList.add('hidden');
    successEl.classList.add('hidden');

    try {
        const response = await fetch('/recoveryPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                cuil
            })
        });

        const data = await response.json();

        if (!response.ok) {
            errorEl.textContent = sanitizeText(data.message || 'No se pudo procesar la solicitud.');
            errorEl.classList.remove('hidden');
            return;
        }

        successEl.textContent = 'Enviamos un mail de recuperación a su correo electrónico.';
        successEl.classList.remove('hidden');
        this.reset();

    } catch (error) {
        console.error('Request failed'); 
        errorEl.textContent = 'No se pudo conectar con el servidor.';
        errorEl.classList.remove('hidden');
    }
});