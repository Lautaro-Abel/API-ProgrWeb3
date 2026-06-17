# Mi Persona - Frontend

Frontend de la aplicación **Mi Persona**, encargado de la interfaz gráfica, validación inicial de datos y gestión de autenticación mediante Access Token.

---

# Tecnologías

- HTML5
- CSS3
- JavaScript

---

# Seguridad implementada

- Sanitización de inputs
- Validaciones de datos
- Almacenamiento temporal de Access Token en memoria
- Integración con Refresh Token en cookies HttpOnly
- Reintento automático de autenticación mediante refresh

---

# Responsabilidades

- Renderizado de la interfaz
- Formularios de registro y login
- Gestión de autenticación con Access Token
- Renovación automática mediante Refresh Token
- Consumo de API REST
- Validación inicial de datos
- Sanitización de entradas

---

# Estructura

```text
frontend/
│── index.html
│── recovery-password.html
│── user-menu.html
│── ops-menu.html
│── index.js
│── recovery-password.js
│── user-menu.js
│── ops-menu.js
│── auth.js
│── security.js
│── index.css
│── menu.css
```

---

# Ejecución

Usar servidor local:

```bash
npx serve .
```

O utilizar Live Server en VScode

Servidor local:

http://localhost:5500

Servidor integrado:

https://localhost:3050

---

# Archivos principales

## `index.js`

Maneja:
- Registro
- Login

---

## `recovery-password.js`

Maneja:
- Recuperación de contraseña

---


## `auth.js`

Maneja:
- Access Token
- Refresh Token
- authFetch()

---

## `security.js`

Maneja:
- Validaciones
- Sanitización

---

## `user-menu.js`

Maneja:
- Perfil usuario
- Turnos
- Certificados
- Licencias
- Seguridad

---

## `ops-menu.js`

Maneja:
- Panel administrador
- Gestión de documentos
- Gestión de usuarios

---