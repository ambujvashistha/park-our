const mongoose = require('mongoose');
const ParkingSlot = require('./models/ParkingSlot');
const connectDB = require('./config/database');
require('dotenv').config();

connectDB();

const slots = [
    { label: 'A1', type: 'Four-wheeler', state: 'Free' },
    { label: 'A2', type: 'Four-wheeler', state: 'Occupied' },
    { label: 'A3', type: 'Four-wheeler', state: 'Free' },
    { label: 'A4', type: 'Four-wheeler', state: 'Reserved' },
    { label: 'A5', type: 'Four-wheeler', state: 'Free' },
    { label: 'A6', type: 'Four-wheeler', state: 'Occupied' },
    { label: 'A7', type: 'Four-wheeler', state: 'Free' },
    { label: 'A8', type: 'Four-wheeler', state: 'Free' },
    { label: 'B1', type: 'Two-wheeler', state: 'Free' },
    { label: 'B2', type: 'Two-wheeler', state: 'Occupied' },
    { label: 'B3', type: 'Two-wheeler', state: 'Free' },
    { label: 'B4', type: 'Two-wheeler', state: 'Free' },
    { label: 'B5', type: 'Two-wheeler', state: 'Reserved' },
    { label: 'B6', type: 'Two-wheeler', state: 'Free' },
];

const seedSlots = async () => {
    try {
        await ParkingSlot.deleteMany({});
        console.log('Cleared existing slots');

        await ParkingSlot.insertMany(slots);
        console.log('Added seed slots successfully');

        console.log('Summary:');
        console.log(`- Total Slots: ${slots.length}`);
        console.log(`- Four-wheelers: ${slots.filter(s => s.type === 'Four-wheeler').length}`);
        console.log(`- Two-wheelers: ${slots.filter(s => s.type === 'Two-wheeler').length}`);

        process.exit();
    } catch (error) {
        console.error('Error seeding slots:', error);
        process.exit(1);
    }
};

seedSlots();
