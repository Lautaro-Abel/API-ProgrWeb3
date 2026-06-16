// ===== Sanitización =====
export function sanitizeText(value) {
    const temp = document.createElement("div");
    temp.textContent = value;
    return temp.innerHTML;
}

// ===== Validaciones =====
export function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password) {
    return /^\S{6,}$/.test(password);
}

export function validateDni(dni) {
    return /^[0-9]{8}$/.test(dni);
}

export function validateCuil(cuil) {
    return /^[0-9]{11}$/.test(cuil);
}

export function validatePhone(phone) {
    return /^[0-9]{10}$/.test(phone);
}