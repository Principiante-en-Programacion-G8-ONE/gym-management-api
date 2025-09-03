const bcrypt = require('bcryptjs');

/**
 * @purpose Hashea una contraseña en texto plano.
 * @param {string} password - La contraseña a hashear.
 * @returns {Promise<string>} - La contraseña hasheada.
 */
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

/**
 * @purpose Compara una contraseña en texto plano con una hasheada.
 * @param {string} password - La contraseña en texto plano.
 * @param {string} hashedPassword - La contraseña hasheada desde la BD.
 * @returns {Promise<boolean>} - True si las contraseñas coinciden, false en caso contrario.
 */
const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};

module.exports = { hashPassword, comparePassword };