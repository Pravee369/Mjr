const express = require('express');
const twilio = require('twilio');
const dotenv = require('dotenv');
const verifyToken = require('./middlewares/verifyToken');

dotenv.config();
const router = express.Router();

const client = new twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
const otpStorage = {}; // Temporary storage, use DB for production.

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOTP = async (phone) => {
    const otp = generateOTP();
    otpStorage[phone] = otp; // Store OTP temporarily.
    console.log("yyyyyyyyyyy ",otp)
    await client.messages.create({
        body: `Your OTP is: ${otp}`,
        from: process.env.TWILIO_NUMBER,
        to: '+918985071044'
    });

    return { success: true, message: 'OTP sent successfully' };
};

const verifyOTP = (phone, otp) => {
    if (otpStorage[phone] && otpStorage[phone] === otp) {
        delete otpStorage[phone]; // OTP is one-time use.
        return { success: true, message: 'OTP verified successfully' };
    }
    return { success: false, message: 'Invalid OTP' };
};

// Define Routes
router.post('/send-otp',verifyToken, async (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).send({ success: false, message: 'Phone number is required' });

    try {
        console.log("Before calling sendOTP");
        const response = sendOTP(phone);
        console.log("its otp sent route")
        res.status(200).send({response});
    } catch (error) {
        res.status(500).send({ success: false, message: 'Failed to send OTP', error });
    }
});

router.post('/verify-otp', (req, res) => {
    const { phone, otp } = req.body;
    console.log("its otp verify route",req)
    if (!phone || !otp) return res.status(400).json({ success: false, message: 'Phone and OTP are required' });

    const response = verifyOTP(phone, otp);
    res.json(response);
});

// Export all functions and routes
module.exports = { generateOTP, sendOTP, verifyOTP, otpAuth: router };
