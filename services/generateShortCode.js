async function generateShortCode() {
  const { nanoid } = await import('nanoid');
  return nanoid(8);
}

module.exports = generateShortCode;