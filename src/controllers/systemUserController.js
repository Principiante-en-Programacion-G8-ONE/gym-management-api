const systemUserModel = require('../models/systemUserModel'); // <-- USAMOS EL MODELO
const { hashPassword, comparePassword } = require('../utils/password');
const jwt = require('jsonwebtoken');

/**
 * @purpose Genera un token JWT para un usuario del sistema.
 * @param {object} user - El objeto del usuario que contiene id, name, email, is_super_admin.
 * @returns {string} - El token JWT firmado.
 */
const generateToken = (user) => {
    const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        is_super_admin: user.is_super_admin
    };
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

/**
 * @purpose Registra un nuevo usuario de sistema (quedará pendiente de aprobación).
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
        const result = await systemUserModel.create({ name, email, hashedPassword });

        res.status(201).json({
            message: 'User registered successfully. Pending admin approval.',
            userId: result.insertId
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email already in use' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error while creating user' });
    }
};

/**
 * @purpose Autentica un usuario de sistema y devuelve un token (solo si está activo).
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */
exports.loginSystemUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscamos por email, sin importar el estado inicial
        const user = await systemUserModel.findByEmail(email);

        if (!user || user.status !== 'active') {
            return res.status(401).json({ message: 'Invalid credentials or user not active' });
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({
            message: 'Login successful',
            token: generateToken(user), // Pasamos el objeto de usuario completo
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
};


/**
 * @purpose Obtiene la lista de usuarios de sistema pendientes de activación.
 * Solo para superadministradores.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */
exports.getPendingUsers = async (req, res) => {
    try {
        const pendingUsers = await systemUserModel.findPending();
        res.status(200).json(pendingUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching pending users' });
    }
};

/**
 * @purpose Activa un usuario de sistema.
 * Solo para superadministradores.
 */
exports.activateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await systemUserModel.activate(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found or already active' });
        }

        res.status(200).json({ message: 'User activated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error activating user' });
    }
};