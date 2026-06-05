const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function verify() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clean up
        await User.deleteOne({ email: 'test_verify@tms.com' });

        console.log('Creating test user...');
        const user = await User.create({
            userName: 'Verify User',
            phoneNumber: '1234567890',
            email: 'test_verify@tms.com',
            password: 'password123',
            role: new mongoose.Types.ObjectId() // Dummy role ID
        });

        console.log('User created successfully!');

        const isMatch = await bcrypt.compare('password123', user.password);
        console.log('Password hash verification:', isMatch ? 'PASSED' : 'FAILED');

        if (isMatch) {
            console.log('VERIFICATION SUCCESSFUL');
        } else {
            console.error('VERIFICATION FAILED: Password not hashed correctly');
            process.exit(1);
        }

    } catch (err) {
        console.error('VERIFICATION FAILED with error:', err.message);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
    }
}

verify();
