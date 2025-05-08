const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // không trùng email
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetOtp: {
        type: Number, // Field to store the OTP
    },
    resetOtpExpires: {
        type: Date, // Field to store the OTP expiration time
    }
});

module.exports = mongoose.model('User', userSchema);