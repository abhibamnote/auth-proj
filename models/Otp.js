const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
    otp: Number,
    email: {
        type: String,
        required: true,
        unique: true
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
        expires: 900,// this is the expiry time in seconds
    }

},{
    timestamps: true
});

OtpSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 900 });

const Otp = mongoose.model("Otp", OtpSchema);

module.exports = Otp;