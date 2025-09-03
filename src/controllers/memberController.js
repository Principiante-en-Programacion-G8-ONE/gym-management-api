const memberModel = require('../models/memberModel');
const { hashPassword } = require('../utils/password');

exports.createMember = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await hashPassword(password);

        const result = await memberModel.create({ name, email, hashedPassword });
        res.status(201).json({ message: 'Member created', id: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Member email already in use' });
        }
        res.status(500).json({ message: 'Error creating member', error: error.message });
    }
};

exports.getAllMembers = async (req, res) => {
    try {
        const members = await memberModel.findAll();
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching members', error: error.message });
    }
};

exports.updateMember = async (req, res) => {
    try {
        const { id } = req.params;
        // Nota: la actualización de contraseña debería tener su propia lógica/endpoint por seguridad.
        const { name, email } = req.body;
        const result = await memberModel.update(id, { name, email });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Member not found' });
        }
        res.status(200).json({ message: 'Member updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating member', error: error.message });
    }
};

exports.deactivateMember = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await memberModel.deactivate(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Member not found' });
        }
        res.status(200).json({ message: 'Member deactivated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deactivating member', error: error.message });
    }
};