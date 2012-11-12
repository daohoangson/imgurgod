var http = require('http');
var util = require('util');
var words = require('./words');

var attempted = {};

exports.pickOne = function(callback) {
  // callback = function(url, word) {};
  var attempt = function() {
    var word = words.pickOne();
    
    var code = '';
    for (var i = 0; i < word.length; i++) {
      if (Math.random() > 0.5) {
        code += word[i].toUpperCase();
      } else {
        code += word[i];
      }
    }
    
    var url = util.format('http://i.imgur.com/%s.jpg', code);
    
    if (typeof attempted[code] == 'undefined') {
      console.info('imgur: checking for %s', code);

      var options = {
        method: 'HEAD',
        host: 'i.imgur.com',
        port: 80,
        headers: {'Accept': '*/*'},
        path: util.format('/%s.jpg', code)
      };
      var req = http.request(options, function(res) {
        if (!!res.headers.etag) {
          // image exists
          attempted[code] = true;
        } else {
          // image not exists
          attempted[code] = false;
        }
        
        attemptDone(url, word, attempted[code]);
      });
      req.end();
    } else {
      console.log('imgur: reuse result for %s', code);
      attemptDone(url, word, attempted[code]);
    }
  };
  
  var attemptDone = function(url, word, urlExists) {
    if (urlExists) {
      return callback(url, word);
    } else {
      attempt();
    }
  };
  
  attempt();
};