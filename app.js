const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { indexRouter } = require('./routes/index');
require('dotenv').config();

const server = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required!!');
    if (!process.env.PORT) throw new Error('PORT is required!!');

    await mongoose.connect(process.env.MONGO_URI);
    mongoose.set('debug', true);
    console.log('MongoDB connected');
    app.use(express.json());

    app.use('/', indexRouter);

    app.listen(process.env.PORT, () =>
      console.log(`Server is listening...Port:${process.env.PORT}`)
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports = app;
server();
