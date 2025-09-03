const pool = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/password');
const jwt = require('jsonwebtoken');

/**
 * @purpose Genera un token JWT para un usuario del sistema.
 * @param {number} id - ID del usuario.
 * @param {string} name - Nombre del usuario.
 * @param {string} email - Email del usuario.
 * @returns {string} - El token JWT firmado.
 */
const generateToken = (id, name, email) => {
    return jwt.sign({ id, name, email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

/**
 * @purpose Registra un nuevo usuario de sistema.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */
exports.registerSystemUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        const hashedPassword = await hashPassword(password);

        const [result] = await pool.query(
            'INSERT INTO system_users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        res.status(201).json({
            message: 'System user created successfully',
            userId: result.insertId
        });
    } catch (error) {
        // Manejo de error para email duplicado
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email already in use' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error while creating user' });
    }
};

/**
 * @purpose Autentica un usuario de sistema y devuelve un token.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */
exports.loginSystemUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    try {
        const [rows] = await pool.query(
            'SELECT * FROM system_users WHERE email = ? AND status = "active"',
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: 'The user not exist'});
        }

        const user = rows[0];
        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({
            message: 'Login successful',
            token: generateToken(user.id, user.name, user.email),
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// Aquí irían más funciones CRUD como updateUser, deactivateUser, etc.