// Routes/authRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');

// Registration Route
router.post('/register', UserController.register);

// Login Route
router.post('/login', UserController.login);

// Forgot Password Route
router.post('/forgot-password', UserController.forgotPassword);

// Reset Password Route
router.post('/reset-password/:token', UserController.resetPassword);

// Route to get current user (protected route)
router.get('/me', authMiddleware, (req, res) => {
    res.json({ email: req.user.email });
});

// Routes/authRoutes.js
router.get('/user/:email', authMiddleware, UserController.getUserByEmail);


module.exports = router;
