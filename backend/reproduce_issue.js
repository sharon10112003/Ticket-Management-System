const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    password: { type: String, required: true },
});

userSchema.pre('save', async function (next) {
    console.log('Pre-save hook started, next is:', typeof next);
    try {
        if (!this.isModified('password')) {
            if (typeof next === 'function') return next();
            return;
        }
        this.password = await bcrypt.hash(this.password, 10);
        console.log('Password hashed, calling next...');
        if (typeof next === 'function') {
            next();
        } else {
            console.log('next is not a function, skipping call');
        }
    } catch (err) {
        console.error('Error in pre-save hook:', err);
        throw err;
    }
});

const User = mongoose.model('User', userSchema);

async function run() {
    try {
        await mongoose.connect('mongodb://localhost:27017/tms_db');
        console.log('Connected to MongoDB');

        // Delete existing test user if any
        await User.deleteOne({ userName: 'testuser_reproduce' });

        const user = await User.create({
            userName: 'testuser_reproduce',
            password: 'password123'
        });
        console.log('User created successfully');
    } catch (err) {
        console.error('FAILED TO CREATE USER:', err.message);
    } finally {
        await mongoose.connection.close();
    }
}

run();
