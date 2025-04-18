const express = require('express');
const router = express.Router();
const Url = require('../models/url.model');
const validateUrl = require('../middlewares/validateUrl');
const validateShortCode = require('../middlewares/validateShortCode');

router.post('/shorten', validateUrl, async (req, res, next) => {
  const { url } = req.body;

  try {
    const existingUrl = await Url.findOne({ url });
    if (existingUrl) {
      return res.status(200).json(existingUrl);
    }

    let shortCode;
    let exists = true;

    while (exists) {
      shortCode = generateShortCode();
      exists = await Url.findOne({ shortCode });
    }

    const newUrl = new Url({ url, shortCode });
    await newUrl.save();

    res.status(201).json({
      id: newUrl._id,
      url: newUrl.url,
      shortCode: newUrl.shortCode,
      createdAt: newUrl.createdAt,
      updatedAt: newUrl.updatedAt,
    });
  } catch (err) {
    next(err); // Pass error to the global error handler
  }
});

// GET stats for a short URL
router.get('/shorten/:shortCode/stats', validateShortCode, async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    const urlEntry = await Url.findOne({ shortCode });

    if (!urlEntry) {
      return res.status(404).json({ message: 'Short URL not found' });
    }

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


router.get('/shorten/:shortCode', validateShortCode, async (req, res, next) => {
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


router.put('/shorten/:shortCode', validateShortCode, validateUrl, async (req, res, next) => {
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


router.delete('/shorten/:shortCode', validateShortCode, async (req, res, next) => {
  const { shortCode } = req.params;

  try {
    // Find the URL by shortCode
    const urlToDelete = await Url.findOneAndDelete({ shortCode });

    if (!urlToDelete) {
      const error = new Error('Short URL not found');
      error.statusCode = 404;
      return next(error);
    }

    
    res.status(200).json({message: "shortCode deleted successfully"});
  } catch (err) {
    next(err); // Pass error to the global error handler
  }
});


module.exports = router;
