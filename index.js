// server.js
const express = require('express');
const connectDB = require('./db');
const dataRoute = require('./routes/dataroutes');
const PORT = 3000;
const app = express();



app.use(express.json());
app.use("/" , dataRoute);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

