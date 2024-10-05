const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    jobPosition: { type: String, required: true },
    technologies: [String],
    password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
