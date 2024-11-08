import express from 'express';
import mongoose, { mongo } from 'mongoose';
import '../models/Consult.js';
import '../models/Professional.js';

const router = express.Router();
const Consult = mongoose.model('Consult');
const Professional = mongoose.model('Professional');

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
  consult.save().then((result) => {
    Professional.findOne({ _id: consult.professional })
      .then((professional) => {
        professional.consults.push(consult);
        professional.save();
        console.log('Consult registered');
        res.status(200).end();
      })
      .catch((err) => {
        console.log('Professional doesnt exist ' + err);
      });
  });
});

router.put('/consult', async (req, res) => {
  Consult.findOneAndUpdate(
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
  Professional.findOneAndUpdate(
    { _id: req.body.professional },
    { $pull: { consults: req.body.id } }
  ).then(() => {
    Consult.findByIdAndDelete({ _id: req.body.id })
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
