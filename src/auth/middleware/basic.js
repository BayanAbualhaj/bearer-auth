'use strict';

const base64 = require('base-64');
const User = require('../models/users');

module.exports = async (req, res, next) => {
  console.log('*******************************************************');

  if (!req.headers.authorization||req.headers.authorization.split(' ')[0] !== 'Basic') { return _authError(next); }
  console.log('*******************************************************');

  let basic = req.headers.authorization.split(' ').pop();
  let [user, pass] = base64.decode(basic).split(':');
  //we need to compair between the pass and the user in authticateBasic from users  
  try {
    req.user = await User.authenticateBasic(user, pass);
    if(req.user){
    console.log('*******************************************************');
      
      next();
    }
  } catch (e) {
    res.status(403).send('Invalid Login');
  }

}

function _authError(next){
  next('NOT BASIC HEADER');
}