const User = require('../models/User');
const Role = require('../models/Role');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).populate('role');
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role.roleName },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                role: user.role.roleName
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Seeding SuperAdmin (Temporary helper for Week 1 requirement)
exports.seedSuperAdmin = async (req, res) => {
    try {
        let superAdminRole = await Role.findOne({ roleName: 'SuperAdmin' });
        if (!superAdminRole) {
            superAdminRole = new Role({ roleName: 'SuperAdmin' });
            await superAdminRole.save();
        }

        const existingAdmin = await User.findOne({ email: 'admin@tms.com' });
        if (existingAdmin) {
            return res.status(200).json({ message: 'SuperAdmin already exists' });
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);
        const admin = new User({
            userName: 'Super Admin',
            phoneNumber: '1234567890',
            email: 'admin@tms.com',
            password: hashedPassword,
            role: superAdminRole._id
        });

        await admin.save();
        res.status(201).json({ message: 'SuperAdmin seeded successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
