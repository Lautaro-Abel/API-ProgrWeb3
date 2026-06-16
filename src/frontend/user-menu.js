import { sanitizeText, validatePhone, validateEmail, validatePassword } from './security.js';
import { initializeAuth, authFetch } from './auth.js';

// ===============================
// Obtención de datos del Usuario
// ===============================
let currentUser = null;

async function loadCurrentUser() {
    try {
        const response = await authFetch('/userData', {
            method: 'GET',
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'No se pudieron cargar los datos.');
        }

        currentUser = data.result[0];

        updateUserInterface();

    } catch (error) {
        console.error('Request failed');
        alert('Sesión inválida o expirada.');
        window.location.href = 'index.html';
    }
}

// ===============================
// Panel de Usuario - Inicio
// ===============================
function updateUserInterface() {
    const title = document.getElementById('welcomeTitle');
    const description = document.getElementById('welcomeDescription');

    if (!title || !description || !currentUser) return;

    title.textContent = `Bienvenido ${sanitizeText(currentUser.name)} ${sanitizeText(currentUser.lastName)}`;

    description.textContent = `CUIL: ${sanitizeText(currentUser.cuil)} | Email: ${sanitizeText(currentUser.email)}`;
}

// ===============================
// Panel
// ===============================
function showPanel(title, html) {

    const panel = document.getElementById('resultPanel');
    const panelTitle = document.getElementById('resultTitle');
    const panelContent = document.getElementById('resultContent');

    if (!panel || !panelTitle || !panelContent) return;

    panelTitle.textContent = title;
    panelContent.innerHTML = html;

    panel.classList.remove('hidden');

    panel.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function clearPanel() {

    const panel = document.getElementById('resultPanel');
    const title = document.getElementById('resultTitle');
    const content = document.getElementById('resultContent');

    if (!panel) return;

    title.textContent = '';
    content.innerHTML = '';

    panel.classList.add('hidden');
}

// ===============================
// Logout
// ===============================
function setupLogout() {

    const logoutBtn = document.getElementById('logoutBtn');

    if (!logoutBtn) return;

    logoutBtn.addEventListener('click', async () => {

        try {

            const response = await authFetch('/logout', {
                method: 'POST',
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                alert(sanitizeText(data.message) || 'No se pudo cerrar sesión.');
                return;
            }

            window.location.href = 'index.html';

        } catch (error) {

            console.error('Request failed');

            alert('Error al conectar con el servidor.');
        }
    });
}

// ===============================
// Mis Datos
// ===============================
function setupUserDataCard() {

    const btn = document.getElementById('showUserData');

    if (!btn) return;

    btn.addEventListener('click', async () => {

        try {

            const response = await authFetch('/userData', {
                method: 'GET',
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(sanitizeText(data.message));
            }

            const user = data.result[0];

            showPanel("Mis Datos", `
                <div class="user-card">

                    <div class="user-card-header">
                        <i class="fa-solid fa-user"></i>
                        <h3>${sanitizeText(user.name)} ${sanitizeText(user.lastName)}</h3>
                    </div>

                    <div class="user-info-grid">

                        <div class="info-item">
                            <span class="info-label">DNI</span>
                            <span class="info-value">${sanitizeText(user.dni)}</span>
                        </div>

                        <div class="info-item">
                            <span class="info-label">CUIL</span>
                            <span class="info-value">${sanitizeText(user.cuil)}</span>
                        </div>

                        <div class="info-item">
                            <span class="info-label">Email</span>
                            <span class="info-value">${sanitizeText(user.email)}</span>
                        </div>

                        <div class="info-item">
                            <span class="info-label">Teléfono</span>
                            <span class="info-value">${sanitizeText(user.numberPhone) || "-"}</span>
                        </div>

                        <div class="info-item">
                            <span class="info-label">Fecha de Nacimiento</span>
                            <span class="info-value">${sanitizeText(user.birthDate)}</span>
                        </div>

                    </div>

                </div>
            `);

        } catch (error) {

            showPanel(
                "Error",
                `<p>${sanitizeText(error.message)}</p>`
            );

        }

    });

}

// ===============================
// Mis Turnos
// ===============================
function setupTurnsCard() {

    const btn = document.getElementById('showTurns');

    if (!btn) return;

    btn.addEventListener('click', async () => {

        try {

            const response = await authFetch('/showTurn', {
                method: 'GET',
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                showPanel('Mis Turnos', `<div class="result-item">${sanitizeText(data.message) || 'Error al obtener los turnos.'}</div>`);
                return;
            }

            const turns = data.result;

            let html = '';

            turns.forEach(turn => {

                html += `
    <div class="resource-card">
        <h4>${sanitizeText(turn.turnName)}</h4>

        <div class="resource-type">
            ${sanitizeText(turn.turnType)}
        </div>

        <p>
            ${sanitizeText(turn.description)}
        </p>
    </div>
`;
            });

            showPanel('Mis Turnos', html);

        } catch (error) {

            console.error('Request failed');

            showPanel(
                'Mis Turnos',
                '<div class="result-item">Error al obtener los turnos.</div>'
            );
        }
    });
}

// ===============================
// Mis Certificados
// ===============================
function setupCertificatesCard() {

    const btn = document.getElementById('showCertificates');

    if (!btn) return;

    btn.addEventListener('click', async () => {

        try {

            const response = await authFetch('/showCertificate', {
                method: 'GET',
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                showPanel('Mis Certificados', `<div class="result-item">${sanitizeText(data.message) || 'Error al obtener los certificados.'}</div>`);
                return;
            }

            const certificates = data.result;

            let html = '';

            certificates.forEach(certificate => {

                html += `
        <div class="resource-card">

            <h4>${sanitizeText(certificate.certificateName)}</h4>

            <div class="resource-type">
                ${sanitizeText(certificate.certificateType)}
            </div>

        </div>
    `;
            });

            showPanel('Mis Certificados', html);

        } catch (error) {

            console.error('Request failed');

            showPanel(
                'Mis Certificados',
                '<div class="result-item">Error al obtener los certificados.</div>'
            );
        }
    });
}

// ===============================
// Mis Licencias
// ===============================
function setupLicencesCard() {

    const btn = document.getElementById('showLicences');

    if (!btn) return;

    btn.addEventListener('click', async () => {

        try {

            const response = await authFetch('/showLicence', {
                method: 'GET',
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                showPanel('Mis Licencias', `<div class="result-item">${sanitizeText(data.message) || 'Error al obtener las licencias.'}</div>`);
                return;
            }

            const licences = data.result;

            let html = '';

            licences.forEach(licence => {

                html += `
        <div class="resource-card">

            <h4>${sanitizeText(licence.licenceName)}</h4>

            <div class="resource-type">
                ${sanitizeText(licence.licenceType)}
            </div>

        </div>
    `;
            });

            showPanel('Mis Licencias', html);

        } catch (error) {

            console.error('Request failed');

            showPanel(
                'Mis Licencias',
                '<div class="result-item">Error al obtener las licencias.</div>'
            );
        }
    });
}

// ===============================
// Eliminar Cuenta
// ===============================
function setupDeleteAccount() {

    const btn = document.getElementById('deleteAccountBtn');

    if (!btn) return;

    btn.addEventListener('click', async () => {

        const confirmed = confirm(
            '¿Está seguro que desea eliminar su cuenta?\n\nEsta acción no se puede deshacer.'
        );

        if (!confirmed) return;

        try {

            const response = await authFetch('/deleteAccount', {
                method: 'DELETE',
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                alert(sanitizeText(data.message) || 'No se pudo eliminar la cuenta.');
                return;
            }

            alert('Cuenta eliminada correctamente.');

            window.location.href = 'index.html';

        } catch (error) {

            console.error('Request failed');

            alert('Error al conectar con el servidor.');
        }
    });
}

// ===============================
// Actualizar Datos Personales
// ===============================
function setupEditProfile() {

    const btn = document.getElementById('editProfileBtn');

    if (!btn) return;

    btn.addEventListener('click', () => {

        showPanel("Actualizar Datos Personales", `
    <div class="form-card">

        <form>

            <div class="form-group">
                <label>Nuevo Teléfono</label>
                <input
                    type="text"
                    id="newPhone"
                    value="${sanitizeText(currentUser.numberPhone || '')}">
            </div>

            <button
                type="button"
                id="saveProfileBtn"
                class="btn-primary">

                Actualizar Datos

            </button>

            <div
                id="profileMessage"
                style="margin-top:15px;">
            </div>

        </form>

    </div>
`);

        setupSaveProfile();
    });
}

function setupSaveProfile() {

    const btn = document.getElementById('saveProfileBtn');

    if (!btn) return;

    btn.addEventListener('click', async () => {

        const newPhone = document.getElementById('newPhone').value.trim();

        if (!validatePhone(newPhone)) {
            document.getElementById('profileMessage').textContent = 'Teléfono inválido.';
            return;
        }

        const messages = [];

        try {

            if (newPhone !== currentUser.numberPhone) {

                const response = await authFetch('/updateNumberPhone', {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        newNumberPhone: newPhone
                    })
                });

                const data = await response.json();

                messages.push(sanitizeText(data.message));

                if (response.ok) {
                    currentUser.numberPhone = newPhone;
                }
            }

            if (messages.length === 0) {
                messages.push('No se detectaron cambios.');
            }

            document.getElementById('profileMessage').textContent = messages.join(' | ');

            updateUserInterface();

        } catch (error) {

            console.error('Request failed');
            document.getElementById('profileMessage').textContent = 'Error al actualizar los datos.';
        }
    });
}

// ===============================
// Seguridad
// ===============================
function setupSecurity() {

    const btn = document.getElementById('securityBtn');

    if (!btn) return;

    btn.addEventListener('click', () => {

        showPanel("Seguridad", `

<div class="form-card">

    <h3>Actualizar Email</h3>

    <div class="form-group">
        <label>Nuevo Email</label>
        <input
            type="email"
            id="newEmail">
    </div>

    <div class="form-group">
        <label>Contraseña Actual</label>
        <input
            type="password"
            id="emailPassword">
    </div>

    <button
        type="button"
        id="updateEmailBtn"
        class="btn-primary">


        Actualizar Email

    </button>

    <hr style="margin:25px 0">

    <h3>Actualizar Contraseña</h3>

    <div class="form-group">
        <label>Contraseña Actual</label>
        <input
            type="password"
            id="currentPassword">
    </div>

    <div class="form-group">
        <label>Nueva Contraseña</label>
        <input
            type="password"
            id="newPassword">
    </div>

    <div class="form-group">
        <label>Confirmar Contraseña</label>
        <input
            type="password"
            id="confirmPassword">
    </div>

    <button
        type="button"
        id="updatePasswordBtn"
        class="btn-primary">

        Actualizar Contraseña

    </button>

    <div
        id="securityMessage"
        style="margin-top:15px;">
    </div>

</div>
`);

        setupUpdateEmail();
        setupUpdatePassword();
    });
}

function setupUpdateEmail() {

    const btn = document.getElementById('updateEmailBtn');

    if (!btn) return;

    btn.addEventListener('click', async () => {

        const newEmail = document.getElementById('newEmail').value.trim();
        const verifyPassword = document.getElementById('emailPassword').value;

        if (!validateEmail(newEmail)) {
            document.getElementById('securityMessage').textContent = 'Email inválido.';
            return;
        }

        try {

            const response = await authFetch('/updateEmail', {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    newEmail,
                    verifyPassword
                })
            });

            const data = await response.json();

            document.getElementById('securityMessage').textContent = sanitizeText(data.message);

            if (response.ok) {

                currentUser.email = newEmail;

                updateUserInterface();
            }

        } catch (error) {

            console.error('Request failed');
            document.getElementById('securityMessage').textContent = 'Error al actualizar el email.';
        }
    });
}

function setupUpdatePassword() {

    const btn = document.getElementById('updatePasswordBtn');

    if (!btn) return;

    btn.addEventListener('click', async () => {

        const password = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const checkPassword = document.getElementById('confirmPassword').value;

        if (!validatePassword(newPassword)) {
            document.getElementById('securityMessage').textContent = 'Contraseña inválida.';
            return;
        }
        if (newPassword !== checkPassword) {
            document.getElementById('securityMessage').textContent = 'Las contraseñas no coinciden.';
            return;
        }

        try {

            const response = await authFetch('/updatePassword', {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    password,
                    newPassword,
                    checkPassword
                })
            });

            const data = await response.json();
            document.getElementById('securityMessage').textContent = sanitizeText(data.message);

            if (response.ok) {

                document.getElementById('currentPassword').value = '';
                document.getElementById('newPassword').value = '';
                document.getElementById('confirmPassword').value = '';
            }

        } catch (error) {

            console.error('Request failed');
            document.getElementById('securityMessage').textContent = 'Error al actualizar la contraseña.';
        }
    });
}

// ===============================
// Solicitar Turnos
// ===============================
function setupGenerateTurn() {

    const btn = document.getElementById('generateTurnBtn');

    if (!btn) return;

    btn.addEventListener('click', async () => {

        try {

            const response = await authFetch('/availableTurns', {
                method: 'GET',
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {

                showPanel(
                    'Solicitar Turno',
                    `<div class="result-item">${sanitizeText(data.message)}</div>`
                );

                return;
            }

            const turns = data.result;

            let html = '';

            turns.forEach((turn, index) => {

                html += `
<div class="turn-card">

    <h4>${sanitizeText(turn.turnName)}</h4>

    <div class="turn-type">
        ${sanitizeText(turn.turnType)}
    </div>

    <div class="turn-description">
        ${sanitizeText(turn.description)}
    </div>

    <button
        class="btn-primary request-turn-btn"
        data-name="${sanitizeText(turn.turnName)}"
        data-type="${sanitizeText(turn.turnType)}">
        Solicitar Turno
    </button>

</div>
`;
            });

            showPanel('Turnos Disponibles', html);

            setupTurnRequestButtons();

        } catch (error) {

            console.error('Request failed');

            showPanel(
                'Turnos Disponibles',
                '<div class="result-item">Error al obtener los turnos.</div>'
            );
        }
    });
}

function setupTurnRequestButtons() {

    const buttons = document.querySelectorAll('.request-turn-btn');

    buttons.forEach(button => {

        button.addEventListener('click', async () => {

            const turnName = button.dataset.name;
            const turnType = button.dataset.type;

            try {

                const response = await authFetch('/generateTurn', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        turnName,
                        turnType
                    })
                });

                const data = await response.json();

                alert(sanitizeText(data.message));

                if (response.ok) {

                    button.disabled = true;
                    button.textContent = 'Solicitado';
                }

            } catch (error) {

                console.error('Request failed');

                alert('Error al solicitar el turno.');
            }
        });

    });
}

// ===============================
// Funciones de Panel
// ===============================
function switchTab(tabId, element) {
    clearPanel();

    document.querySelectorAll('.tab-content').forEach(tab =>
        tab.classList.remove('active')
    );
    document.querySelectorAll('.top-menu li').forEach(li =>
        li.classList.remove('active')
    );
    document.getElementById(tabId).classList.add('active');
    if (element) {
        element.classList.add('active');
    }
}

function setupTabs() {
    document.querySelectorAll('[data-tab]').forEach(item => {
        item.addEventListener('click', () => {

            const tabId = item.dataset.tab;

            let navElement = item;

            if (item.dataset.navTarget) {
                navElement = document.getElementById(item.dataset.navTarget);
            }

            switchTab(tabId, navElement);
        });
    });
}

// ===============================
// Init
// ===============================
document.addEventListener('DOMContentLoaded', async () => {
    await initializeAuth();
    await loadCurrentUser();

    setupUserDataCard();
    setupLogout();
    setupTurnsCard();
    setupCertificatesCard();
    setupLicencesCard();
    setupDeleteAccount();
    setupEditProfile();
    setupSecurity();
    setupGenerateTurn();
    setupTabs();
});