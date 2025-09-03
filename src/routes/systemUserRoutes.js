const express = require('express');
const router = express.Router();
const {
    registerSystemUser,
    loginSystemUser,
    getPendingUsers,
    activateUser
} = require('../controllers/systemUserController');
const { protect, isSuperAdmin  } = require('../middlewares/authMiddleware');

// Rutas públicas
router.post('/register', registerSystemUser);
router.post('/login', loginSystemUser);

// Ejemplo de ruta protegida
router.get('/profile', protect, (req, res) => {
    // La información del usuario está en req.user gracias al middleware 'protect'
    res.json(req.user);
});

router.get('/pending', protect, isSuperAdmin, getPendingUsers);
router.patch('/:id/activate', protect, isSuperAdmin, activateUser);

module.exports = router;