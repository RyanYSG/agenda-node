import mongoose from 'mongoose';
import { Schema } from 'mongoose';

// Defining User Schema
const ProfessionalSchema = Schema({
  full_name: {
    type: String,
    require: true,
  },

  email: {
    type: String,
    require: true,
  },

  phone_number: {
    type: String,
    require: true,
  },

  password: {
    type: String,
    require: true,
  },

  consults: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Consult',
    },
  ],
});

mongoose.model('Professional', ProfessionalSchema);
