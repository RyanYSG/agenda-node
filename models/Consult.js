import mongoose from 'mongoose';
import { Schema } from 'mongoose';

// Defining User Schema
const ConsultSchema = Schema({
  date: {
    type: Date,
    require: true,
  },

  professional: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: 'Professional',
  },

  user: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: 'User',
  },
});

mongoose.model('Consult', ConsultSchema);
