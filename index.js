const express = require('express');
const connectDB = require('../db');
const dataRoute = require('../routes/dataroutes');

const app = express();

// Middleware
app.use(express.json());
app.use("/", dataRoute);

// Export it as a function to use it as a serverless function
module.exports = (req, res) => {
  app(req, res);
};
