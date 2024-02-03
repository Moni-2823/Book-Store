const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        maxLength: [60, `email must be max 30 characters`]
    },
    password: String,
    token: String,
    role: { type: String, enum: ['Author', 'Admin', 'RetailUser'] },
},
{
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);