const express = require('express');
const router = express.Router();
const { register, login, registerCustomer, forgotPassword, resetPassword } = require('../controllers/authController');

// POST /api/auth/register (admin registration)
router.post('/register', register);

// POST /api/auth/login (works for both admin and customer)
router.post('/login', login);

// POST /api/auth/register-customer
router.post('/register-customer', registerCustomer);

// POST /api/auth/forgot-password
router.post('/forgot-password', forgotPassword);

// POST /api/auth/reset-password/:token
router.post('/reset-password/:token', resetPassword);

module.exports = router;

