const express = require('express');
const router = express.Router();
const {
    createMember,
    getAllMembers,
    updateMember,
    deactivateMember
} = require('../controllers/memberController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/', createMember);
router.get('/', getAllMembers);
router.put('/:id', updateMember);
router.patch('/:id/deactivate', deactivateMember);

module.exports = router;