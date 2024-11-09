const User = require('../models/User');
const otpGenerator = require('otp-generator');
const transporter = require('../config/transporter'); // Assuming you have a transporter config for nodemailer

exports.requestOTP = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username, password });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
        user.otp = otp;
        await user.save();

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: user.email,
            subject: 'OTP for Login',
            text: `Your OTP for login is: ${otp}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending OTP email:', error);
                return res.status(500).json({ success: false, message: 'Failed to send OTP' });
            } else {
                console.log('OTP email sent:', info.response);
                return res.status(200).json({ success: true, message: 'OTP sent successfully' });
            }
        });
    } catch (error) {
        console.error('Error occurred during OTP request:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.verifyOTP = async (req, res) => {
    const { username, otp } = req.body;

    try {
        const user = await User.findOne({ username, otp });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid OTP' });
        }

        user.otp = null;
        await user.save();

        return res.status(200).json({ success: true, user, message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Error occurred during OTP verification:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
