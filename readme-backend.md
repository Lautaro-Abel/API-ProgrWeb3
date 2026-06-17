# Mi Persona - Backend

Backend de la aplicación **Mi Persona**, encargado de autenticación, autorización, acceso a base de datos y lógica de negocio.

---

# Tecnologías

- Node.js
- Express.js
- SQLite Cloud

---

# Seguridad Implementada

- CORS
- Hash de contraseñas con bcrypt
- JWT Authentication (Access & Refresh Token)
- Refresh Token Rotation
- Cookies HttpOnly
- Role-based Authorization
- Validación de inputs
- Sanitización
- Protección contra SQL Injection
- Rate limiting

---

# Responsabilidades

- Registro de usuarios
- Login
- Logout
- Refresh Token
- Recuperación de contraseña
- Gestión de cuentas de usuario
- Gestión de cuentas de Administrador
- Autorización por roles

---

# Estructura

```text
backend/
│── .env
│── cert.pem
│── key.pem
│── miPersona.js
```

---

# Instalación

Instalar dependencias:

```bash
npm install
```

---

# Variables de entorno

Crear archivo `.env`

```env
SECRET_KEY_JWT=
SECRET_REFRESH_KEY_JWT=

RATE_TIME=
RATE_MAX=

JWT_EXPIRES_IN=
JWT_REFRESH_EXPIRES_IN=

HTTP_PORT=3000
HTTPS_PORT=3050

BCRYPT_ROUNDS=
SSL_KEY_PATH=key.pem
SSL_CERT_PATH=cert.pem

CONNECTION_DB=
DATABASE_NAME=

```

---

# Ejecución

```bash
node miPersona.js
```

Servidor:

```text
https://localhost:3050
```

---

# Endpoints

## Auth

```text
POST /register
POST /login
POST /logout
POST /refresh
POST /recovery-password
```

---

## Usuario

```text
GET /userData
PUT /updateEmail
PUT /updatePassword
PUT /updateNumberPhone
DELETE /deleteAccount
```

---

## Turnos

```text
GET /showTurn
GET /availableTurns
POST /generateTurn
POST /createTurn
```

---

## Certificados

```text
GET /showCertificate
GET /availableCertificates
POST /generateCertificate
POST /createCertificate
```

---

## Licencias

```text
GET /showLicence
GET /availableLicences
POST /generateLicence
POST /createLicence
```

---

## Administrador

```text
GET /accountsList
```

---

# Middlewares

- verifyToken
- authorizationRole
- validateBody
- limiter