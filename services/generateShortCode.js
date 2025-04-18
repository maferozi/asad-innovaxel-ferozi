const generateShortCode = () => {
    return Math.random().toString(36).substring(2, 8); // Generates a 6-character short code
  };

  module.exports = generateShortCode;