const mongoose = require('mongoose');
const Role = require('./models/Role');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function fixRoles() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const roleFixes = [
            { from: 'Network Staff', to: 'Networking Staff' },
            { from: 'Electrican', to: 'Electrician' }
        ];

        for (const fix of roleFixes) {
            const result = await Role.updateOne(
                { roleName: fix.from },
                { $set: { roleName: fix.to } }
            );
            if (result.matchedCount > 0) {
                console.log(`Updated role: "${fix.from}" -> "${fix.to}"`);
            } else {
                console.log(`Role not found: "${fix.from}"`);
            }
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

fixRoles();
