const { nanoid } = require('nanoid');

const generateShortCode = () => {
  return nanoid(8);  // Generates an 8-character long short code
};

module.exports = generateShortCode;
