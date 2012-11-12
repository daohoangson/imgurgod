var words = require('./lists/processed').words;

exports.pickOne = function() {
  return words[Math.floor(Math.random() * words.length)];
};