const express = require('express');
const router = express.Router();
const Anomaly = require('../models/Anomaly');

// @route GET /api/anomalies
// @desc Get all anomaly logs
router.get('/', async (req, res) => {
  try {
    const anomalies = await Anomaly.find({}, { __v: 0 }).sort({ createdAt: -1 });
    res.json(anomalies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch anomaly logs' });
  }
});

module.exports = router;
