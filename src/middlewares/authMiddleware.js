const jwt = require('jsonwebtoken');

/**
 * @purpose Middleware para verificar el token JWT de autenticación.
 * Protege las rutas asegurando que solo usuarios autenticados puedan acceder.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Obtener el token del header (Bearer TOKEN)
            token = req.headers.authorization.split(' ')[1];

            // Verificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Adjuntar la información del usuario a la solicitud
            // Aquí excluimos la contraseña y otra información sensible si la hubiera
            req.user = decoded;

            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };