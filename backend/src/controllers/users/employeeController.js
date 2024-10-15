const Employee = require('../../models/employee');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Add a new employee
exports.addEmployee = async (req, res) => {
    try {
        const { firstName, lastName, email, username, password, phoneNumber } = req.body;

        // Hash the password 
        const hashedPassword = await bcrypt.hash(password, 10);

        const newEmployee = new Employee({
            firstName,
            lastName,
            email,
            username,
            password: hashedPassword,
            phoneNumber
        });

        await newEmployee.save();
        res.status(201).json({ message: 'Employee added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an existing employee
exports.updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an employee
exports.deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedEmployee = await Employee.findByIdAndDelete(id);

        if (!deletedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Employee login
exports.loginEmployee = async (req, res) => {
    try {
        const { username, password } = req.body;

        const employee = await Employee.findOne({ username });

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, employee.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: employee._id }, 'your_jwt_secret', { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all employees
exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

