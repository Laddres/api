#!/usr/bin/env nodejs
const dotenv = require('dotenv')
dotenv.config();

const app = require('./src/app');

app.listen(3000, () => {
  console.log('Laddres is listening on port 3000!');
})
