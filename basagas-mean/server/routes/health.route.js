const express = require('express');
const Ping = require('../models/ping.model');

const router = express.Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

router.post('/ping', async (_req, res) => {
  try {
    const ping = await Ping.create({ createdAt: new Date() });
    res.status(201).json({ _id: ping._id });
  } catch (error) {
    console.error('Failed to record ping', error);
    res.status(500).json({ error: 'Failed to record ping' });
  }
});

module.exports = router;
