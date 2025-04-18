const { param, validationResult } = require('express-validator');

// Middleware to validate shortCode param
const validateShortCode = [
  param('shortCode')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Short code must be alphanumeric or hyphen')
    .isLength({ min: 6, max: 10 }).withMessage('Short code must be between 6 and 10 characters long'),

  // Handle validation result and send errors if any
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validateShortCode;
