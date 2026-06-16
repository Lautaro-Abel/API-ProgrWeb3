import { sanitizeText } from './security.js';
import { initializeAuth, authFetch } from './auth.js';


// ===============================
// Panel
// ===============================
function showPanel(title, html) {
    const panel = document.getElementById('resultPanel');
    const panelTitle = document.getElementById('resultTitle');
    const panelContent = document.getElementById('resultContent');

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
            await authFetch('/logout', {
                method: 'POST',
                credentials: 'include'
            });

        } catch (error) {
            console.error('Request failed');
        }

        window.location.href = 'index.html';
    });
}

// ===============================
// Usuarios
// ===============================
function setupUsersList() {
    const btn = document.getElementById('showUsers');

    if (!btn) return;

    btn.addEventListener('click', async () => {
        try {
            const response = await authFetch('/accountsList', {
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                showPanel(
                    'Usuarios',
                    `<div class="result-item">${sanitizeText(data.message)}</div>`
                );
                return;
            }

            const users = data.result || [];

            let html = `
                <table class="users-table">
                    <thead>
                        <tr>
                            <th>DNI</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Email</th>
                            <th>Rol</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            users.forEach(user => {
                html += `
                    <tr>
                        <td>${sanitizeText(user.dni)}</td>
                        <td>${sanitizeText(user.name)}</td>
                        <td>${sanitizeText(user.lastName)}</td>
                        <td>${sanitizeText(user.email)}</td>
                        <td>${sanitizeText(user.role)}</td>
                    </tr>
                `;
            });

            html += `
                    </tbody>
                </table>
            `;

            showPanel('Usuarios Registrados', html);

        } catch (error) {
            console.error('Request failed');

            showPanel(
                'Usuarios',
                '<div class="result-item">Error al obtener usuarios.</div>'
            );
        }
    });
}

// ===============================
// Crear Certificado
// ===============================
function setupCreateCertificate() {
    const btn = document.getElementById('createCertificateBtn');

    if (!btn) return;

    btn.addEventListener('click', () => {
        showPanel('Crear Certificado', `
            <div class="form-container">
                <form id="createCertificateForm">

                    <div class="form-group">
                        <label>Nombre del Certificado</label>
                        <input type="text" id="certificateName" required>
                    </div>

                    <div class="form-group">
                        <label>Tipo</label>
                        <input type="text" id="certificateType" required>
                    </div>

                    <div class="form-group">
                        <label>Descripción</label>
                        <textarea id="certificateDescription" rows="4" required></textarea>
                    </div>

                    <button type="submit" class="btn-primary">
                        Crear Certificado
                    </button>

                </form>
            </div>
        `);

        setupCreateCertificateSubmit();
    });
}

function setupCreateCertificateSubmit() {
    const form = document.getElementById('createCertificateForm');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const certificateName = document.getElementById('certificateName').value.trim();
        const certificateType = document.getElementById('certificateType').value.trim();
        const description = document.getElementById('certificateDescription').value.trim();

        if (!certificateName || !certificateType || !description) {
            alert('Complete todos los campos.');
            return;
        }

        try {
            const response = await authFetch('/createCertificate', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    certificateName,
                    certificateType,
                    description
                })
            });

            const data = await response.json();

            alert(sanitizeText(data.message));

            if (response.ok) clearPanel();

        } catch (error) {
            console.error('Request failed');
            alert('Error de conexión con el servidor');
        }
    });
}

// ===============================
// Crear Licencia
// ===============================
function setupCreateLicence() {
    const btn = document.getElementById('createLicenceBtn');

    if (!btn) return;

    btn.addEventListener('click', () => {
        showPanel('Crear Licencia', `
            <div class="form-container">
                <form id="createLicenceForm">

                    <div class="form-group">
                        <label>Nombre de la Licencia</label>
                        <input type="text" id="licenceName" required>
                    </div>

                    <div class="form-group">
                        <label>Tipo</label>
                        <input type="text" id="licenceType" required>
                    </div>

                    <div class="form-group">
                        <label>Descripción</label>
                        <textarea id="description" required></textarea>
                    </div>

                    <button type="submit" class="btn-primary">
                        Crear Licencia
                    </button>

                </form>
            </div>
        `);

        setupCreateLicenceSubmit();
    });
}

function setupCreateLicenceSubmit() {
    const form = document.getElementById('createLicenceForm');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const licenceName = document.getElementById('licenceName').value.trim();
        const licenceType = document.getElementById('licenceType').value.trim();
        const description = document.getElementById('description').value.trim();

        if (!licenceName || !licenceType || !description) {
            alert('Complete todos los campos.');
            return;
        }

        try {
            const response = await authFetch('/createLicence', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    licenceName,
                    licenceType,
                    description
                })
            });

            const data = await response.json();

            alert(sanitizeText(data.message));

            if (response.ok) clearPanel();

        } catch (error) {
            console.error('Request failed');
            alert('Error de conexión con el servidor');
        }
    });
}

// ===============================
// Crear Turno
// ===============================
function setupCreateTurn() {
    const btn = document.getElementById('createTurnBtn');

    if (!btn) return;

    btn.addEventListener('click', () => {
        showPanel('Crear Turno', `
            <div class="form-container">
                <form id="createTurnForm">

                    <div class="form-group">
                        <label>Nombre del Turno</label>
                        <input type="text" id="turnName" required>
                    </div>

                    <div class="form-group">
                        <label>Tipo</label>
                        <input type="text" id="turnType" required>
                    </div>

                    <div class="form-group">
                        <label>Descripción</label>
                        <textarea id="turnDescription" rows="4" required></textarea>
                    </div>

                    <button type="submit" class="btn-primary">
                        Crear Turno
                    </button>

                </form>
            </div>
        `);

        setupCreateTurnSubmit();
    });
}

function setupCreateTurnSubmit() {
    const form = document.getElementById('createTurnForm');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const turnName = document.getElementById('turnName').value.trim();
        const turnType = document.getElementById('turnType').value.trim();
        const description = document.getElementById('turnDescription').value.trim();

        if (!turnName || !turnType || !description) {
            alert('Complete todos los campos.');
            return;
        }

        try {
            const response = await authFetch('/createTurn', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    turnName,
                    turnType,
                    description
                })
            });

            const data = await response.json();

            alert(sanitizeText(data.message));

            if (response.ok) clearPanel();

        } catch (error) {
            console.error('Request failed');
            alert('Error de conexión con el servidor');
        }
    });
}

// ===============================
// Asignar Certificado
// ===============================
function setupAssignCertificate() {
    const btn = document.getElementById('assignCertificateBtn');

    if (!btn) return;

    btn.addEventListener('click', async () => {
        try {
            const [usersRes, certificatesRes] = await Promise.all([
                authFetch('/accountsList', { credentials: 'include' }),
                authFetch('/availableCertificates', { credentials: 'include' })
            ]);

            const usersData = await usersRes.json();
            const certificatesData = await certificatesRes.json();

            const users = usersData.result || [];
            const certificates = certificatesData.result || [];

            if (users.length === 0 || certificates.length === 0) {
                alert('Seleccione opciones validas.');
                return;
            }

            const usersOptions = users
                .filter(user => user.role === 'user')
                .map(user => `
                    <option value="${sanitizeText(user.dni)}">
                        ${sanitizeText(user.name)} ${sanitizeText(user.lastName)}
                    </option>
                `).join('');

            const certificateOptions = certificates
                .map(cert => `
                    <option value="${sanitizeText(cert.certificateName)}|${sanitizeText(cert.certificateType)}">
                        ${sanitizeText(cert.certificateName)} (${sanitizeText(cert.certificateType)})
                    </option>
                `).join('');

            showPanel('Asignar Certificado', `
                <div class="form-container">
                    <form id="assignCertificateForm">

                        <div class="form-group">
                            <label>Ciudadano</label>
                            <select id="accountDni">${usersOptions}</select>
                        </div>

                        <div class="form-group">
                            <label>Certificado</label>
                            <select id="certificateSelect">${certificateOptions}</select>
                        </div>

                        <button type="submit" class="btn-primary">
                            Asignar Certificado
                        </button>

                    </form>
                </div>
            `);

            setupAssignCertificateSubmit();

        } catch (error) {
            console.error('Request failed');
            alert('Error al cargar información');
        }
    });
}

function setupAssignCertificateSubmit() {
    const form = document.getElementById('assignCertificateForm');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const accountDni = document.getElementById('accountDni').value;
        const [certificateName, certificateType] = document.getElementById('certificateSelect').value.split('|');

        if (!accountDni || !certificateName || !certificateType) {
            alert('Seleccione una opción válida.');
            return;
        }

        try {
            const response = await authFetch('/generateCertificate', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    accountDni,
                    certificateName,
                    certificateType
                })
            });

            const data = await response.json();

            alert(sanitizeText(data.message));

            if (response.ok) clearPanel();

        } catch (error) {
            console.error('Request failed');
            alert('Error de conexión');
        }
    });
}

// ===============================
// Asignar Licencia
// ===============================
function setupAssignLicence() {
    const btn = document.getElementById('assignLicenceBtn');

    if (!btn) return;

    btn.addEventListener('click', async () => {
        try {
            const [usersRes, licencesRes] = await Promise.all([
                authFetch('/accountsList', { credentials: 'include' }),
                authFetch('/availableLicences', { credentials: 'include' })
            ]);

            const usersData = await usersRes.json();
            const licencesData = await licencesRes.json();

            const users = usersData.result || [];
            const licences = licencesData.result || [];

            if (users.length === 0 || licences.length === 0) {
                alert('Seleccione opciones validas.');
                return;
            }

            const usersOptions = users
                .filter(user => user.role === 'user')
                .map(user => `
                    <option value="${sanitizeText(user.dni)}">
                        ${sanitizeText(user.name)} ${sanitizeText(user.lastName)}
                    </option>
                `).join('');

            const licenceOptions = licences
                .map(licence => `
                    <option value="${sanitizeText(licence.licenceName)}|${sanitizeText(licence.licenceType)}">
                        ${sanitizeText(licence.licenceName)} (${sanitizeText(licence.licenceType)})
                    </option>
                `).join('');

            showPanel('Asignar Licencia', `
                <div class="form-container">
                    <form id="assignLicenceForm">

                        <div class="form-group">
                            <label>Ciudadano</label>
                            <select id="accountDni">${usersOptions}</select>
                        </div>

                        <div class="form-group">
                            <label>Licencia</label>
                            <select id="licenceSelect">${licenceOptions}</select>
                        </div>

                        <button type="submit" class="btn-primary">
                            Asignar Licencia
                        </button>

                    </form>
                </div>
            `);

            setupAssignLicenceSubmit();

        } catch (error) {
            console.error('Request failed');
            alert('Error al cargar información');
        }
    });
}

function setupAssignLicenceSubmit() {
    const form = document.getElementById('assignLicenceForm');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const accountDni = document.getElementById('accountDni').value;
        const [licenceName, licenceType] = document.getElementById('licenceSelect').value.split('|');

        if (!accountDni || !licenceName || !licenceType) {
            alert('Seleccione una opción válida.');
            return;
        }

        try {
            const response = await authFetch('/generateLicence', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    accountDni,
                    licenceName,
                    licenceType
                })
            });

            const data = await response.json();

            alert(sanitizeText(data.message));

            if (response.ok) clearPanel();

        } catch (error) {
            console.error('Request failed');
            alert('Error de conexión');
        }
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

    setupLogout();
    setupTabs();
    setupUsersList();
    setupCreateCertificate();
    setupCreateLicence();
    setupCreateTurn();
    setupAssignCertificate();
    setupAssignLicence();
});