const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const connectDB = require('./config/database');
require('dotenv').config();
connectDB();

const ADMIN_EMAIL = 'admin@parkease.com';
const ADMIN_PASSWORD = 'Admin@123';
const ADMIN_NAME = 'Admin User';

async function seedAdmin() {
    try {
        const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

        if (existingAdmin) {
            console.log('Admin account already exists');
            return;
        }
        const admin = new User({
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            role: 'admin'
        });

        await admin.save();
        console.log('Admin account created successfully');
        console.log(`   Email: ${ADMIN_EMAIL}`);
        console.log(`   Password: ${ADMIN_PASSWORD}`);
    } catch (error) {
        console.error('Error creating admin account:', error.message);
    } finally {
        mongoose.connection.close();
    }
}

seedAdmin();
