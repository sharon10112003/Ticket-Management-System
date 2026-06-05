const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '.env') });

async function resetPasswords() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const emailsToReset = [
            'sharongilbert2003@gmail.com', // User
            'network@tms.com',            // Network Staff
            'electrican@tms.com',         // Electrican
            'plumber@tms.com',            // Plumber
            'testuser@tms.com'            // Another User
        ];

        for (const email of emailsToReset) {
            const user = await User.findOne({ email });
            if (user) {
                // The pre-save hook in User.js handles hashing
                user.password = 'admin123';
                await user.save();
                console.log(`Password reset for: ${email}`);
            } else {
                console.log(`User not found: ${email}`);
            }
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

resetPasswords();
