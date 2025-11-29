const express = require('express');
const router = express.Router();
const ParkingSlot = require('../models/ParkingSlot');
const SlotLog = require('../models/SlotLog');
const { auth } = require('../middleware/auth');

router.use(auth);

router.get('/utilization', async (req, res) => {
    try {
        const totalSlots = await ParkingSlot.countDocuments();

        if (totalSlots === 0) {
            return res.json({
                utilization: 0,
                totalSlots: 0,
                occupiedSlots: 0,
                message: 'No parking slots configured'
            });
        }

        const occupiedSlots = await ParkingSlot.countDocuments({
            state: { $in: ['Occupied', 'Reserved'] }
        });

        const utilization = ((occupiedSlots / totalSlots) * 100).toFixed(2);

        res.json({
            utilization: parseFloat(utilization),
            totalSlots,
            occupiedSlots,
            freeSlots: totalSlots - occupiedSlots
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/peak-hours', async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const logs = await SlotLog.find({
            timestamp: { $gte: sevenDaysAgo },
            newState: { $in: ['Occupied', 'Reserved'] }
        });

        const hourlyActivity = Array(24).fill(0);

        logs.forEach(log => {
            const hour = new Date(log.timestamp).getHours();
            hourlyActivity[hour]++;
        });

        const peakHoursData = hourlyActivity
            .map((count, hour) => ({ hour, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);

        const formatHour = (hour) => {
            const period = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
            return `${displayHour}:00 ${period}`;
        };

        const peakHours = peakHoursData.map(({ hour, count }) => ({
            hour,
            time: formatHour(hour),
            activity: count
        }));

        const totalActivity = logs.length;
        const hasData = totalActivity > 0;

        res.json({
            peakHours,
            totalActivity,
            hasData,
            hourlyActivity,
            analysisPeriod: '7 days'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
