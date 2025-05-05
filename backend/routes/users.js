const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Post = require('../models/Post');

const router = express.Router();


router.post('/', async (req, res) => {
  try {
    const { username, fullname, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, fullname, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User created', userId: user._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Пользователь не найден' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Неверный пароль' });

    res.json({
      userId: user._id,
      username: user.username,
      fullname: user.fullname,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const search = req.query.search || '';
    const filter = search
      ? { username: { $regex: search, $options: 'i' } }
      : {};
    const users = await User.find(filter).select('username fullname');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const { fullname, bio, location } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { fullname, bio, location },
      { new: true }
    ).select('-password');
    if (!updated) return res.status(404).json({ error: 'Пользователь не найден' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
