const config = require('config')
const Joi = require('joi');
require('express-async-errors')
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const user = require('./routes/user')
const auth = require('./routes/auth')
const error = require('./middleware/error')
const express = require('express');
const app = express();

if (!config.get('jwtPrivateKey')) {
  console.error('Fatal error: jwtPrivateKey is not defined.')
  process.exit(1) // process Node的全局变量， exit方法， 一个传参， 0表示成功， 0之外表示失败
  // 设置全局变量的方法： export vidly_jwtPrivateKey=mySecureKey
}

mongoose.connect('mongodb://localhost:27017/testDB')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', user);
app.use('/api/auth', auth);

app.use(error)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));