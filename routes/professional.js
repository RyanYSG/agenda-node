import express from 'express';
import mongoose from 'mongoose';
import '../models/Professional.js';

const router = express.Router();
const Professional = mongoose.model('Professional');

router.post('/register', async (req, res) => {
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

export default router;
