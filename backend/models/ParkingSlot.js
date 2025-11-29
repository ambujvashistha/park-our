const mongoose = require('mongoose');

const parkingSlotSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Two-wheeler', 'Four-wheeler']
    },
    state: {
        type: String,
        required: true,
        enum: ['Free', 'Occupied', 'Reserved'],
        default: 'Free'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ParkingSlot', parkingSlotSchema);
