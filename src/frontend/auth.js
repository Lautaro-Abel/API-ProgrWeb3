let accessToken = null; //Guarda el accessToken creado al iniciar sesión

export async function initializeAuth() { //Inicialización del accessToken
    try {
        const response = await fetch('/refresh', {
            method: 'POST',
            credentials: 'include'
        });

        if (!response.ok) {
            window.location.href = 'index.html';
            return;
        }

        const data = await response.json();
        accessToken = data.accessToken;

    } catch {
        window.location.href = 'index.html';
    }
}

export async function authFetch(url, options = {}) {  //Autenticación utilizando el accessToken
    options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`
    };

    let response = await fetch(url, {
        ...options,
        credentials: 'include'
    });

    if (response.status === 401) { //Si hay un error 401, actualiza el refreshToken
        const refreshResponse = await fetch('/refresh', {
            method: 'POST',
            credentials: 'include'
        });

        if (!refreshResponse.ok) {
            window.location.href = 'index.html';
            return;
        }

        const data = await refreshResponse.json();
        accessToken = data.accessToken;

        options.headers.Authorization = `Bearer ${accessToken}`;

        response = await fetch(url, {
            ...options,
            credentials: 'include'
        });
    }

    return response;
}