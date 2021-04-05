'use strict';

// Start up DB Server
const dotenv= require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
mongoose.connect(process.env.MONGODB_URI, options).then(()=>{
  
  // Start the web server
  require('./src/server').startup(process.env.PORT);

}).catch((err)=>{
  console.log("CONNECTION ERROR  ",err);
});
