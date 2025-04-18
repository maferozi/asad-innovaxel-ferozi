const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const urlRoutes = require('./routes/url.route');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api', urlRoutes);

app.get('/', (req, res) => {
  res.send('URL Shortener API');
});

module.exports = app;
