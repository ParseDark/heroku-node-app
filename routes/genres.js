const {
  Genre,
  validate
} = require('../models/genre');
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

// 在express 的每一个routers， 中，第一个参数为路由地址， 第二个参数为处理中间件， 第三个是回调函数
router.post('/', auth, async (req, res) => {

  //  权限校验, 普通方式
  // const token = req.header('x-auth-token')
  // res.status(401)


  const {
    error
  } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({
    name: req.body.name
  });
  genre = await genre.save();

  res.send(genre);
});

router.put('/:id', async (req, res) => {
  const {
    error
  } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(req.params.id, {
    name: req.body.name
  }, {
    new: true
  });

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

module.exports = router;