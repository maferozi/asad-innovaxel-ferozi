const { body, validationResult } = require('express-validator');


const validateUrl = [
  // Validate that 'url' is provided and is a valid URL
  body('url')
    .isURL().withMessage('Please provide a valid URL')
    .notEmpty().withMessage('URL is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validateUrl;
