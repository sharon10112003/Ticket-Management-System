const mongoose = require('mongoose');
const Role = require('./models/Role');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function checkRoles() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const roles = await Role.find();
        console.log('--- Current Roles in DB ---');
        roles.forEach(r => {
            console.log(`ID: ${r._id} | Name: "${r.roleName}"`);
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkRoles();
