const pool = require('../config/database');

/**
 * @purpose Crea un nuevo usuario de sistema en la base de datos.
 * @param {object} userData - Datos del usuario { name, email, hashedPassword }.
 * @returns {Promise<object>} - El resultado de la inserción.
 */
exports.create = async (userData) => {
    const { name, email, hashedPassword } = userData;
    const [result] = await pool.query(
        'INSERT INTO system_users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
    );
    return result;
};

/**
 * @purpose Busca un usuario de sistema por su email.
 * @param {string} email - El email del usuario a buscar.
 * @returns {Promise<object|null>} - El objeto del usuario si se encuentra, o null.
 */
exports.findByEmail = async (email) => {
    const [rows] = await pool.query('SELECT * FROM system_users WHERE email = ?', [email]);
    return rows[0] || null;
};

/**
 * @purpose Obtiene todos los usuarios con estado 'pending'.
 * @returns {Promise<Array>} - Un arreglo de usuarios pendientes.
 */
exports.findPending = async () => {
    const [rows] = await pool.query(
        'SELECT id, name, email, status, created_at FROM system_users WHERE status = "pending"'
    );
    return rows;
};

/**
 * @purpose Cambia el estado de un usuario a 'active'.
 * @param {number} id - El ID del usuario a activar.
 * @returns {Promise<object>} - El resultado de la actualización.
 */
exports.activate = async (id) => {
    const [result] = await pool.query(
        'UPDATE system_users SET status = "active" WHERE id = ?',
        [id]
    );
    return result;
};