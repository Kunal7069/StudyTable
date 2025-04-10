require('dotenv').config();
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendOTP = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        
        const otpResponse = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
            .verifications
            .create({ to: phoneNumber, channel: 'sms' });

        res.status(200).json({ message: 'OTP sent successfully', status: otpResponse.status });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { phoneNumber, otpCode } = req.body;
        
        const verificationCheck = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
            .verificationChecks
            .create({ to: phoneNumber, code: otpCode });

        if (verificationCheck.status === 'approved') {
            res.status(200).json({ message: 'OTP Verified Successfully!' });
        } else {
            res.status(400).json({ message: 'Invalid OTP. Please try again.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { sendOTP, verifyOTP };