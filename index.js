import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import user from './routes/user.js';
import secretary from './routes/secretary.js';
import professional from './routes/professional.js';
import cors from 'cors';

const app = express();
const port = 3333;

// Mongo connection
mongoose.Promise = global.Promise;

const connection = mongoose
  .connect('mongodb://localhost/apae-system')
  .then(() => {
    console.log('Connected to mongo database.');
  })
  .catch((err) => {
    console.log('Error connecting to mongo database: ' + err);
  });

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/user', user);
app.use('/secretary', secretary);
app.use('/professional', professional);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.delete('/', (req, res) => {
  res.send('Hi');
});

// App setup
app.listen(port, () => {
  console.log('App running and listening to port: ' + port);
});
