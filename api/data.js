const express = require('express');
const connectDB = require('../db');
const dataRoute = require('../routes/dataroutes');

const app = express();


app.use(express.json());
app.use("/", dataRoute);

module.exports = (req, res) => {
  app(req, res);
};
