const express = require('express');
const router = express.Router();
const { register, login, registerCustomer } = require('../controllers/authController');

// POST /api/auth/register (admin registration)
router.post('/register', register);

// POST /api/auth/login (works for both admin and customer)
router.post('/login', login);

// POST /api/auth/register-customer
router.post('/register-customer', registerCustomer);

module.exports = router;

