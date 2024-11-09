import express from 'express';
import mongoose from 'mongoose';
import '../models/User.js';
import '../models/Consult.js';

const router = express.Router();
const User = mongoose.model('User');
const Consult = mongoose.model('Consult');

router.get('/', async (req, res) => {
  await User.findOne({ _id: req.body.id })
    .populate('consult')
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      console.log('User doesnt exist ' + err);
      res.status(400).end();
    });
});

router.post('/', async (req, res) => {
  const newUser = {
    full_name: req.body.full_name,
    email: req.body.email,
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

router.put('/', async (req, res) => {
  await User.findOneAndUpdate(
    { _id: req.body.id },
    {
      full_name: req.body.full_name,
      email: req.body.email,
      phone_number: req.body.phone_number,
      password: req.body.password,
      consult: req.body.consult,
    }
  ).then(async (user) => {
    await Consult.findOneAndUpdate({ _id: user.consult }, { user: user._id })
      .then(() => {
        console.log('User updated');
        res.status(200).end();
      })
      .catch((err) => {
        console.log('Couldnt update user ' + err);
        res.status(400).end();
      });
  });
});

router.delete('/', async (req, res) => {
  await Consult.findOneAndUpdate(
    { _id: req.body.consult },
    { $unset: { user: req.body.id } }
  ).then(async () => {
    await User.findByIdAndDelete({ _id: req.body.id })
      .then(() => {
        console.log('Deleted user');
        res.status(200).end();
      })
      .catch((err) => {
        console.log('Couldnt delete ' + err);
        res.status(400).end();
      });
  });
});

export default router;
