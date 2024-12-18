import express from 'express';
import mongoose, { mongo } from 'mongoose';
import '../models/Consult.js';
import '../models/Professional.js';
import '../models/User.js';

const router = express.Router();
const Consult = mongoose.model('Consult');
const Professional = mongoose.model('Professional');
const User = mongoose.model('User');

router.get('/consult', async (req, res) => {
  const consults = await Consult.find({})
    .populate('user professional')
    .then((consults) => {
      res.status(200).send(consults);
    });
});

router.post('/consult', async (req, res) => {
  const consult = new Consult();
  consult.date = req.body.date;
  consult.professional = req.body.professional;
  consult.user = req.body.user;
  await consult.save().then(async (result) => {
    await Professional.findOne({ _id: consult.professional })
      .then(async (professional) => {
        professional.consults.push(consult);
        professional.save();

        await User.findOne({ _id: req.body.user })
          .then((user) => {
            user.consult = consult._id;
            user.save();
            console.log('Consult registered');
            res.status(200).end();
          })
          .catch((err) => {
            console.log('User doesnt exist ' + err);
            res.status(400).end();
          });
      })
      .catch((err) => {
        console.log('Professional doesnt exist ' + err);
        res.status(400).end();
      });
  });
});

router.put('/consult', async (req, res) => {
  await Consult.findOneAndUpdate(
    { _id: req.body.id },
    {
      date: req.body.date,
      professional: req.body.professional,
      user: req.body.user,
    }
  )
    .then(() => {
      console.log('Updated consult');
      res.status(200).end();
    })
    .catch((err) => {
      console.log('Couldnt update ' + err);
      res.status(400).end();
    });
});

router.delete('/consult', async (req, res) => {
  await Professional.findOneAndUpdate(
    { _id: req.body.professional },
    { $pull: { consults: req.body.id } }
  ).then(async () => {
    await Consult.findByIdAndDelete({ _id: req.body.id })
      .then(() => {
        console.log('Deleted consult');
        res.status(200).end();
      })
      .catch((err) => {
        console.log('Couldnt delete ' + err);
        res.status(400).end();
      });
  });
});

export default router;
