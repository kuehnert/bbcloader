const express = require('express');
const router = new express.Router();
const User = require('../models/user');

// LOGIN
router.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();

    res.send({user, token});
  } catch (error) {
    res.status(400).send({ error: "Unable to login" });
  }
});

// CREATE
router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();

    res.status(201).send({user, token});
  } catch (error) {
    res.status(400).send(error);
  }
});

// FETCH ALL
router.get('/users', async (_, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.sendStatus(500);
  }
});

// FETCH
router.get('/users/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);

    if (!user) {
      return res.sendStatus(404);
    }

    res.status(200).send(user);
  } catch (error) {
    res.sendStatus(500);
  }
});

// PATCH
router.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password'];
  const isValidOperation = updates.every((attr) => allowedUpdates.includes(attr));

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.sendStatus(404);
    }

    updates.forEach(update => user[update] = req.body[update]);
    await user.save();

    res.send(user);
  } catch (error) {
    res.sendStatus(400);
  }
});

module.exports = router;
