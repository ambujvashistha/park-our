const express = require('express');
const router = express.Router();
const ParkingSlot = require('../models/ParkingSlot');
const SlotLog = require('../models/SlotLog');
const { auth, isAdmin } = require('../middleware/auth');

router.use(auth);
router.use(isAdmin);
router.post('/slots', async (req, res) => {
    try {
        const { label, type } = req.body;

        if (!label || !type) {
            return res.status(400).json({ error: 'Label and type are required' });
        }

        const slot = new ParkingSlot({ label, type });
        await slot.save();

        await SlotLog.create({
            slotId: slot._id,
            previousState: null,
            newState: 'Free',
            changedBy: req.user.email
        });

        res.status(201).json(slot);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Slot label already exists' });
        }
        res.status(500).json({ error: error.message });
    }
});

router.get('/slots', async (req, res) => {
    try {
        const slots = await ParkingSlot.find().sort({ label: 1 });
        res.json(slots);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.put('/slots/:id', async (req, res) => {
    try {
        const { state } = req.body;

        if (!state || !['Free', 'Occupied', 'Reserved'].includes(state)) {
            return res.status(400).json({ error: 'Valid state is required' });
        }

        const slot = await ParkingSlot.findById(req.params.id);
        if (!slot) {
            return res.status(404).json({ error: 'Slot not found' });
        }

        const previousState = slot.state;
        slot.state = state;
        slot.updatedAt = Date.now();
        await slot.save();

        await SlotLog.create({
            slotId: slot._id,
            previousState,
            newState: state,
            changedBy: req.user.email
        });

        res.json(slot);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/slots/:id/logs', async (req, res) => {
    try {
        const logs = await SlotLog.find({ slotId: req.params.id })
            .sort({ timestamp: -1 })
            .limit(50);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/slots/:id', async (req, res) => {
    try {
        const slot = await ParkingSlot.findByIdAndDelete(req.params.id);
        if (!slot) {
            return res.status(404).json({ error: 'Slot not found' });
        }
        await SlotLog.deleteMany({ slotId: req.params.id });

        res.json({ message: 'Slot deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
