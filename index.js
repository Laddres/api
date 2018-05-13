'use strict'

import dotenv from 'dotenv';
dotenv.config();

import app from './src/app';

app.listen(3000, () => {
  console.log('Laddres is listening on port 3000!');
})
