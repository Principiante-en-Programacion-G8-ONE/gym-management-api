const pool = require('../config/database');

exports.create = async (memberData) => {
    const { name, email, hashedPassword } = memberData;
    const [result] = await pool.query(
        'INSERT INTO members (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
    );
    return result;
};

exports.findAll = async () => {
    const [rows] = await pool.query('SELECT id, name, email, membership_id, status FROM members WHERE status = "active"');
    return rows;
};

exports.update = async (id, memberData) => {
    // Esta función se puede expandir para actualizar más campos
    const { name, email } = memberData;
    const [result] = await pool.query(
        'UPDATE members SET name = ?, email = ? WHERE id = ?',
        [name, email, id]
    );
    return result;
};

exports.deactivate = async (id) => {
    const [result] = await pool.query('UPDATE members SET status = "inactive" WHERE id = ?', [id]);
    return result;
};