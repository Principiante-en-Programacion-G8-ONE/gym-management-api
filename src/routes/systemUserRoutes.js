const express = require('express');
const router = express.Router();
const { registerSystemUser, loginSystemUser } = require('../controllers/systemUserController');
const { protect } = require('../middlewares/authMiddleware');

// Rutas públicas
router.post('/register', registerSystemUser);
router.post('/login', loginSystemUser);

// Ejemplo de ruta protegida
router.get('/profile', protect, (req, res) => {
    // La información del usuario está en req.user gracias al middleware 'protect'
    res.json(req.user);
});

module.exports = router;