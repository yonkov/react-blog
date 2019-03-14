const express = require('express');
const path = require('path'); 
const bodyParser = require('body-parser');
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
require('./database/database')();
const app = express();
const cors = require('cors');



app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

// General error handling
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
  next();
});

app.use(express.static(path.join(__dirname, 'front-end/build')));


app.get('*', function (req, res) {
   res.sendFile(path.join(__dirname+'/front-end/build/index.html'));
 });

 const port = process.env.PORT || 9999;

app.listen(port, () => { console.log(`REST API listening on port: ${port}`) });