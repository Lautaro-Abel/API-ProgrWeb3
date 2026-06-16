// ===================================================
//   MI PERSONA DIGITAL (Login/Register)
// ===================================================

import {
    sanitizeText,
    validateEmail,
    validatePassword,
    validateDni,
    validateCuil,
    validatePhone
} from './security.js';

const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

// Toggle Box entre login y registro
registerBtn.addEventListener('click', () => container.classList.add('active'));
loginBtn.addEventListener('click', () => container.classList.remove('active'));


// ===== REGISTRO =====
document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const nombre = document.getElementById('regNombre').value.trim();
    const apellido = document.getElementById('regApellido').value.trim();
    const dni = document.getElementById('regDni').value.trim();
    const cuil = document.getElementById('regCuil').value.trim();
    const fecha = document.getElementById('regFecha').value;
    const telefono = document.getElementById('regTelefono').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const errorEl = document.getElementById('registerError');

    const selectedDate = new Date(fecha);
    const today = new Date();

    if (!nombre || !apellido || !dni || !cuil || !fecha || !telefono || !email || !password) {
        errorEl.textContent = 'Por favor complete todos los campos.';
        errorEl.classList.remove('hidden');
        return;
    } else if (!validateDni(dni) || !validateCuil(cuil) || !validatePhone(telefono) || !validateEmail(email) || !validatePassword(password)) {
        errorEl.textContent = 'Datos inválidos.';
        errorEl.classList.remove('hidden');
        return;
    } else if (selectedDate > today) {
        errorEl.textContent = 'Fecha inválida.';
        errorEl.classList.remove('hidden');
        return;
    }

    errorEl.classList.add('hidden');

    try {

        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                dni,
                cuil,
                password,
                name: nombre,
                lastName: apellido,
                numberPhone: telefono,
                email,
                birthDate: fecha
            })
        });

        const data = await response.json();

        if (!response.ok) {
            errorEl.textContent = sanitizeText(data.message || 'No se pudo crear la cuenta.');
            errorEl.classList.remove('hidden');
            return;
        }

        errorEl.classList.add('hidden');

        alert('Cuenta creada correctamente.');

        container.classList.remove('active');

        document.getElementById('registerForm').reset();

    } catch (error) {

        console.error('Request failed');

        errorEl.textContent = 'No se pudo conectar con el servidor.';
        errorEl.classList.remove('hidden');
    }
});

// ===== LOGIN =====
document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const cuil = document.getElementById('loginCuil').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');

    if (!cuil || !password) {
        errorEl.textContent = 'Por favor complete todos los campos.';
        errorEl.classList.remove('hidden');
        return;
    } else if (!validateCuil(cuil) || !validatePassword(password)) {
        errorEl.textContent = 'Datos inválidos.';
        errorEl.classList.remove('hidden');
        return;
    }

    errorEl.classList.add('hidden');

    try {

        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ cuil, password })
        });

        const data = await response.json();
        accessToken = data.accessToken;

        if (!response.ok) {
            errorEl.textContent = sanitizeText(data.message || 'Datos incorrectos, vuelva a intentarlo.');
            errorEl.classList.remove('hidden');
            return;
        } else {
            if (data.role === 'ops') {
                window.location.href = 'ops-menu.html';
            } else {
                window.location.href = 'user-menu.html';
            }
        }

    } catch (error) {

        console.error('Request failed');
        errorEl.textContent = 'No se pudo conectar con el servidor.';
        errorEl.classList.remove('hidden');
    }
});