var crypto = require('crypto');

exports.generate = function(something) {
  var timestamp = Math.floor(new Date().getTime() / 1000);
  var randomNumber = Math.floor(Math.random() * 9999 + 1);
  var hash = generateHash(timestamp, randomNumber, something);
  
  return [timestamp, randomNumber, hash];
};

exports.validate = function(something, data) {
  if (typeof data != 'object'
    || data.length != 3
    || typeof data[0] == 'undefined'
    || typeof data[1] == 'undefined'
    || typeof data[2] == 'undefined') {
    // invalid data
    return false;
  }
  
  var currentTimestamp = Math.floor(new Date().getTime() / 1000);
  var timestamp = data[0];
  var randomNumber = data[1];
  var hash = data[2];
  
  if (timestamp > currentTimestamp
    || timestamp < currentTimestamp - 300) {
    // timestamp in the future (!?)
    // or timestamp is too old (5 minutes)
    return false;
  }
  
  if (hash != generateHash(timestamp, randomNumber, something)) {
    // wrong hash
    return false;
  }
  
  return true;
}

var generateHash = function(timestamp, randomNumber, something) {
  var algo = crypto.createHash('sha1');
  
  algo.update(String(timestamp));
  algo.update(String(randomNumber));
  algo.update(String(something));
  
  return algo.digest();
};