const membershipModel = require('../models/membershipModel');

/**
 * @purpose Crea una nueva membresía.
 */
exports.createMembership = async (req, res) => {
    try {
        const result = await membershipModel.create(req.body);
        res.status(201).json({ message: 'Membership created', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating membership', error: error.message });
    }
};

/**
 * @purpose Obtiene todas las membresías.
 */
exports.getAllMemberships = async (req, res) => {
    try {
        const memberships = await membershipModel.findAll();
        res.status(200).json(memberships);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching memberships', error: error.message });
    }
};

/**
 * @purpose Actualiza una membresía existente.
 */
exports.updateMembership = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await membershipModel.update(id, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Membership not found' });
        }
        res.status(200).json({ message: 'Membership updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating membership', error: error.message });
    }
};

/**
 * @purpose Desactiva una membresía.
 */
exports.deactivateMembership = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await membershipModel.deactivate(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Membership not found' });
        }
        res.status(200).json({ message: 'Membership deactivated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deactivating membership', error: error.message });
    }
};