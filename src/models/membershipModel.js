const pool = require('../config/database');

/**
 * @purpose Crea una nueva membresía en la base de datos.
 * @param {object} membershipData - Datos de la membresía { name, description, price, duration_days }.
 * @returns {Promise<object>} - El resultado de la inserción.
 */
exports.create = async (membershipData) => {
    const { name, description, price, duration_days } = membershipData;
    const [result] = await pool.query(
        'INSERT INTO memberships (name, description, price, duration_days) VALUES (?, ?, ?, ?)',
        [name, description, price, duration_days]
    );
    return result;
};

/**
 * @purpose Obtiene todas las membresías activas.
 * @returns {Promise<Array>} - Un arreglo de objetos de membresía.
 */
exports.findAll = async () => {
    const [rows] = await pool.query('SELECT * FROM memberships WHERE status = "active"');
    return rows;
};

/**
 * @purpose Actualiza una membresía por su ID.
 * @param {number} id - El ID de la membresía.
 * @param {object} membershipData - Los datos a actualizar.
 * @returns {Promise<object>} - El resultado de la actualización.
 */
exports.update = async (id, membershipData) => {
    const { name, description, price, duration_days } = membershipData;
    const [result] = await pool.query(
        'UPDATE memberships SET name = ?, description = ?, price = ?, duration_days = ? WHERE id = ?',
        [name, description, price, duration_days, id]
    );
    return result;
};

/**
 * @purpose Desactiva una membresía (borrado lógico).
 * @param {number} id - El ID de la membresía a desactivar.
 * @returns {Promise<object>} - El resultado de la actualización.
 */
exports.deactivate = async (id) => {
    const [result] = await pool.query(
        'UPDATE memberships SET status = "inactive" WHERE id = ?',
        [id]
    );
    return result;
}