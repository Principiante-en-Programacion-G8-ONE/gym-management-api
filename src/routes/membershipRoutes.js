const express = require('express');
const router = express.Router();
const {
    createMembership,
    getAllMemberships,
    updateMembership,
    deactivateMembership
} = require('../controllers/membershipController');
const { protect } = require('../middlewares/authMiddleware');

// Aplicar el middleware de protección a todas las rutas de membresías
router.use(protect);

router.post('/', createMembership);
router.get('/', getAllMemberships);
router.put('/:id', updateMembership);
router.patch('/:id/deactivate', deactivateMembership); // Usamos PATCH para acciones parciales como desactivar

module.exports = router;