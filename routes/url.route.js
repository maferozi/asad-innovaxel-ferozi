const express = require('express');
const router = express.Router();
const Url = require('../models/url.model');

// GET /api/shorten/:shortCode
router.get('/shorten/:shortCode', async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    const urlEntry = await Url.findOne({ shortCode });

    if (!urlEntry) {
      return res.status(404).json({ message: 'Short URL not found' });
    }

    // Increment access count
    urlEntry.accessCount += 1;
    urlEntry.updatedAt = new Date();
    await urlEntry.save();

    res.status(200).json(urlEntry);
  } catch (err) {
    next(err); // Pass error to middleware
  }
});

module.exports = router;
