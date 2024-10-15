const Manager = require('../../models/manager');
const crypto = require('crypto');

// Generate a random username
const generateRandomUsername = () => {
    return 'MAN' + crypto.randomInt(100, 999);
};
// Create a new manager
const createManager = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, password } = req.body;

        // Generate a random username
        const username = generateRandomUsername();

        // Create a new manager entry
        const manager = await Manager.create({
            firstName,
            lastName,
            email,
            username,
            phoneNumber,
            password
        });

        res.status(201).json({ 
            status: 'success',
            data: manager,
            message: 'Manager created successfully'
        });
    } catch (error) {
        res.status(400).json({ message: 'Error creating manager', error: error });
        console.log(error);
    }
};

// Get all managers
const getAllManagers = async (req, res) => {
    try {
        const managers = await Manager.find();
        res.status(200).json(managers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get one manager by ID
const getManagerById = async (req, res) => {
    try {
        const manager = await Manager.findById(req.params.id);
        if (!manager) {
            return res.status(404).json({ message: 'Manager not found' });
        }
        res.status(200).json(manager);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a manager by ID
const deleteManagerById = async (req, res) => {
    try {
        const manager = await Manager.findByIdAndDelete(req.params.id);
        if (!manager) {
            return res.status(404).json({ message: 'Manager not found' });
        }
        res.status(200).json({ message: 'Manager deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a manager by ID
const updateManagerById = async (req, res) => {
    try {
        const updatedManager = await Manager.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedManager) {
            return res.status(404).json({ message: 'Manager not found' });
        }
        res.status(200).json(updatedManager);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Manager login
const loginManager = async (req, res) => {
    try {
        const { username, password } = req.body;
        const manager = await Manager.findOne({ username });

        if (!manager || manager.password !== password) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        res.status(200).json({ message: 'Login successful', manager });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getAllManagers,
    getManagerById,
    deleteManagerById,
    updateManagerById,
    loginManager
};