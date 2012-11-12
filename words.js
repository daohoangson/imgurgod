var words = require('./lists/processed').words;

exports.pickOne = function() {
  return words[0];
  return words[Math.floor(Math.random() * words.length)];
};