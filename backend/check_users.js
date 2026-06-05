const mongoose = require('mongoose');
const User = require('./models/User');
const Role = require('./models/Role');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const users = await User.find().populate('role');
        console.log('--- Current Users ---');
        users.forEach(u => {
            console.log(`Name: ${u.userName} | Email: ${u.email} | Role: ${u.role ? u.role.roleName : 'No Role'}`);
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkUsers();
