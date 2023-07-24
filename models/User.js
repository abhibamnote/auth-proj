const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: String,
    password: String,
    role: {
        type: String,
        required: true,
        default: "user",
        enum: ["user", "admin"]
    },
    uuid:{
        type: String,
        unique: true
    },
    websites: Array,
    googleId:{
        type: String,
        allowNull: true
    }
},{
    timestamps: true
});

const User = mongoose.model("User", UserSchema);

module.exports = User;