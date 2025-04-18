const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const urlRoutes = require('./routes/url.route');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api', urlRoutes);

app.get('/', (req, res) => {
  res.send('URL Shortener API');
});

app.use(errorHandler);

module.exports = app;
