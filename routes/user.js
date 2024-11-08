import express from 'express';
import mongoose from 'mongoose';
import '../models/User.js';

const router = express.Router();
const User = mongoose.model('User');

router.post('/register', async (req, res) => {
  const newUser = {
    full_name: req.body.full_name,
    emai: req.body.email,
    phone_number: req.body.phone_number,
    password: req.body.password,
  };

  await new User(newUser)
    .save()
    .then(() => {
      console.log('User registered');
      res.status(200).end();
    })
    .catch((err) => {
      console.log('Error registering: ' + err);
      res.status(400).end();
    });
});

export default router;
