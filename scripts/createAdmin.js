const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const createAdmin = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/campus-eye');

    const existing = await User.findOne({ username: 'admin@fast.com' });
    if (existing) {
        console.log("Admin user already exists.");
        return process.exit();
    }

    const hashedPassword = await bcrypt.hash('admin007', 10);
    const adminUser = new User({
        username: 'admin@fast.com',
        password: hashedPassword,
    });

    await adminUser.save();
    console.log("Admin user created!");
    process.exit();
};

createAdmin();
