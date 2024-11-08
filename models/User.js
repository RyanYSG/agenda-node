import mongoose from 'mongoose';
import { Schema } from 'mongoose';

// Defining User Schema
const UserSchema = Schema({
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
});

mongoose.model('User', UserSchema);