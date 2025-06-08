"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePostalCode = exports.validatePhone = exports.validateEmail = exports.validatePassword = void 0;
const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
        errors.push('Le mot de passe doit contenir au moins 8 caractères');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Le mot de passe doit contenir au moins une majuscule');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Le mot de passe doit contenir au moins une minuscule');
    }
    if (!/\d/.test(password)) {
        errors.push('Le mot de passe doit contenir au moins un chiffre');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Le mot de passe doit contenir au moins un caractère spécial');
    }
    return {
        isValid: errors.length === 0,
        errors
    };
};
exports.validatePassword = validatePassword;
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.validateEmail = validateEmail;
const validatePhone = (phone) => {
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    return phoneRegex.test(phone);
};
exports.validatePhone = validatePhone;
const validatePostalCode = (postalCode) => {
    const postalCodeRegex = /^[0-9]{5}$/;
    return postalCodeRegex.test(postalCode);
};
exports.validatePostalCode = validatePostalCode;
