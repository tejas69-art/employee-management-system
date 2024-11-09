const express = require('express');
const router = express.Router();
const Employee = require('../models/employee');
const upload = require('../middleware/upload');
const {
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    toggleEmployeeStatus
} = require('../controllers/employeeController');

// Get all employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add new employee
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, email, mobile, designation, gender } = req.body;
        const courses = JSON.parse(req.body.courses);
        const imagePath = req.file ? req.file.path : '';

        const newEmployee = new Employee({
            name,
            email,
            mobile,
            designation,
            gender,
            courses,
            imagePath
        });

        const savedEmployee = await newEmployee.save();
        res.status(201).json(savedEmployee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


router.route('/')
    .get(getAllEmployees)
    .post(createEmployee);

router.route('/:id')
    .put(updateEmployee)
    .delete(deleteEmployee);

router.route('/:id/toggle-status')
    .put(toggleEmployeeStatus);

module.exports = router;