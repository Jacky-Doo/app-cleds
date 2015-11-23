'use strict';

var UserSchema = new mongoose.Schema({
  username: String,
  password: String
});

module.exports = mongoose.model('User', UserSchema);  //注册User model并暴露该model