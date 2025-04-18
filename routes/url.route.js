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

router.get('/shorten/:shortCode', async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    // Find the URL by shortCode
    const urlEntry = await Url.findOne({ shortCode });

    if (!urlEntry) {
      return res.status(404).json({ message: 'Short URL not found' });
    }

    // Update access count and timestamp
    urlEntry.accessCount += 1;
    urlEntry.updatedAt = new Date();
    await urlEntry.save();

    res.status(200).json({
      id: urlEntry._id,
      url: urlEntry.url,
      shortCode: urlEntry.shortCode,
      createdAt: urlEntry.createdAt,
      updatedAt: urlEntry.updatedAt,
      accessCount: urlEntry.accessCount,
    });
  } catch (error) {
    next(error); // Send to error handler
  }
});


router.put('/shorten/:shortCode', async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const { url } = req.body;

    // Find the short URL entry
    const urlEntry = await Url.findOne({ shortCode });

    if (!urlEntry) {
      return res.status(404).json({ message: 'Short URL not found' });
    }

    // Update the URL and updatedAt
    urlEntry.url = url;
    urlEntry.updatedAt = new Date();

    await urlEntry.save();

    res.status(200).json({
      id: urlEntry._id,
      url: urlEntry.url,
      shortCode: urlEntry.shortCode,
      createdAt: urlEntry.createdAt,
      updatedAt: urlEntry.updatedAt,
      accessCount: urlEntry.accessCount,
    });
  } catch (error) {
    next(error);
  }
});



module.exports = router;
