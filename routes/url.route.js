const express = require('express');
const Url = require('../models/url.model');
const generateShortCode = require('../services/generateShortCode');
const router = express.Router();


router.post('/shorten', async (req, res) => {
  const { url } = req.body;

  // Validate the URL
  if (!url || !/^https?:\/\/[^\s]+$/.test(url)) {
    return res.status(400).json({ message: 'Invalid URL' });
  }

  try {
    const existingUrl = await Url.findOne({ url });
    if (existingUrl) {
      return res.status(200).json(existingUrl); // Return existing URL if already shortened
    }

    // Generate a unique short code
    let shortCode;
    let isUnique = false;

    // Keep generating a new shortCode until it's unique
    while (!isUnique) {
      shortCode = generateShortCode();
      const urlWithCode = await Url.findOne({ shortCode });
      if (!urlWithCode) {
        isUnique = true;
      }
    }

    // Create a new short URL document
    const newUrl = new Url({
      url,
      shortCode,
    });

    // Save the document to MongoDB
    await newUrl.save();

    // Send back the new short URL
    res.status(201).json({
      id: newUrl._id,
      url: newUrl.url,
      shortCode: newUrl.shortCode,
      createdAt: newUrl.createdAt,
      updatedAt: newUrl.updatedAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
