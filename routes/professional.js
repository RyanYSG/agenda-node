import express from 'express';
import mongoose from 'mongoose';
import '../models/Consult.js';
import '../models/Professional.js';

const router = express.Router();
const Consult = mongoose.model('Consult');
const Professional = mongoose.model('Professional');

router.get('/', async (req, res) => {
  await Professional.findOne({ _id: req.body.id })
    .populate('consults')
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      console.log('User doesnt exist ' + err);
      res.status(400).end();
    });
});

router.post('/', async (req, res) => {
  const newProfessional = {
    full_name: req.body.full_name,
    emai: req.body.email,
    phone_number: req.body.phone_number,
    password: req.body.password,
  };

  await new Professional(newProfessional)
    .save()
    .then(() => {
      console.log('Professional registered');
      res.status(200).end();
    })
    .catch((err) => {
      console.log('Error registering: ' + err);
      res.status(400).end();
    });
});

router.put('/', async (req, res) => {
  await Professional.findOneAndUpdate(
    { _id: req.body.id },
    {
      full_name: req.body.full_name,
      email: req.body.email,
      phone_number: req.body.phone_number,
      password: req.body.password,
      consults: req.body.consults,
    }
  ).then(async (professional) => {
    professional.consults.forEach(async (element) => {
      console.log(element);
      await Consult.findOneAndUpdate(
        { _id: element._id },
        { professional: professional._id }
      );
    });
  });
});

router.delete('/', async (req, res) => {
  await Consult.findOneAndUpdate(
    { _id: req.body.consult },
    { $unset: { professional: req.body.id } }
  ).then(async () => {
    await Professional.findByIdAndDelete({ _id: req.body.id })
      .then(() => {
        console.log('Deleted professional');
        res.status(200).end();
      })
      .catch((err) => {
        console.log('Couldnt delete ' + err);
        res.status(400).end();
      });
  });
});

export default router;
