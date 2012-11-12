var http = require('http');
var util = require('util');
var db = require('./db');
var words = require('./words');

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
    
    var url = null;
    var url = util.format('http://i.imgur.com/%s.jpg', code); // no extension found
    var dbUrl = util.format('imgur/%s', code); // save database space...
    
    db.imageUrls.exists(dbUrl, function(exists_err, exists_result) {
      if (exists_result == null) {
        console.info('imgur: checking for %s', code);

        var urlExists = null;
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
            if (res.headers['content-length'] < 10000) {
              // image is too small, just ignore it
              urlExists = false;
            } else {
              urlExists = true;
            }
          } else {
            // image not exists
            urlExists = false;
          }
          
          db.imageUrls.update(dbUrl, urlExists);
          attemptDone(url, word, urlExists);
        });
        req.end();
      } else {
        console.log('imgur: reuse result for %s', code);
        attemptDone(url, word, exists_result);
      }
    })
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