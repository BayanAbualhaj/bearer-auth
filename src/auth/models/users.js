'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv= require('dotenv');
dotenv.config();

const users = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Adds a virtual field to the schema. We can see it, but it never persists
// So, on every user object ... this.token is now readable!
users.virtual('token').get(function () {
  let tokenObject = {
    username: this.username,
  }
  return jwt.sign(tokenObject,process.env.SECRET)
});

// users.statics.generateToken= function(user){
//   let tokenObject = {
//     username: user.username
//   };
//   return jwt.sign(tokenObject,process.env.SECRET);
// }

users.pre('save', async function () {
  console.log('saaaaaaaaaaaaaave',this);
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// BASIC AUTH
users.statics.authenticateBasic = async function (username, password) {
  try {
    const user = await this.findOne({ username })
    if (user) {
      const valid = await bcrypt.compare(password, user.password)
      if (valid) { return user; }
      throw new Error('Invalid User');
      
    } else {
      throw new Error('Not found user');
      
    }
  } catch (error) {
    throw new Error ('Invalid Password or username');
  }
}

// BEARER AUTH
users.statics.authenticateWithToken = async function (token) {
  try {
    const parsedToken = jwt.verify(token, process.env.SECRET);
    const user = await this.findOne({ username: parsedToken.username })
    if (user) { return user; }
    throw new Error("User Not Found");
  } catch (e) {
    throw new Error(e.message)
  }
}


module.exports = mongoose.model('users', users);
