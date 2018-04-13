#!/usr/bin/env nodejs
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.status(200).send('Hello World, Laddres!');
});

app.listen(3000, () => {
  console.log('Laddres is listening on por 3000!');
})
