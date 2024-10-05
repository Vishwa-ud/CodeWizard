const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/config');

// Register
exports.register = async (req, res) => {
    const { username, email, jobPosition, technologies, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            jobPosition,
            technologies,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Login
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Get user details by email
exports.getUserByEmail = async (req, res) => {
    const email = req.params.email;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Forgot Password (stub for implementation)
exports.forgotPassword = (req, res) => {
    // Logic for forgot password
    res.status(501).json({ msg: 'Forgot password functionality is not implemented' });
};

// Reset Password (stub for implementation)
exports.resetPassword = (req, res) => {
    // Logic for reset password
    res.status(501).json({ msg: 'Reset password functionality is not implemented' });
};
