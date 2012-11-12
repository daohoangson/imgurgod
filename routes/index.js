var util = require('util');
var antispam = require('../antispam');
var config = require('../config');
var db = require('../db');
var imgur = require('../imgur');

exports.index = function(req, res) {
  var step1 = function() {
    return imgur.pickOne(step2);
  };
  
  var step2 = function(url, word) {
    db.images.insert(url, function(insert_err, insert_result) {
      if (insert_err) {
        return step1();
      }
      
      return step3(insert_result, word);
    });
  };
  
  var step3 = function(image, word) {
    var imageId = String(image._id);
    var antispamData = antispam.generate(getSomethingForAntispam(req, imageId));

    return res.render('index', {
      title: config.phrases.title,

      imageId: imageId,
      imageUrl: image.url,

      word: word,
      question: util.format(config.phrases.question, word),

      antispam: JSON.stringify(antispamData)
    });
  };
  
  step1();
};

exports.submit = function(req, res) {
  var imageId = req.body.imageId;
  var word = req.body.word;
  var isYes = !!req.body.yes;
  var antispamData = JSON.parse(req.body.antispam);

  if (!imageId || !word || !antispamData) {
    return res.render('error', {
      title: config.phrases.error,
      message: config.phrases.error_incomplete_data
    });
  }
  
  if (!antispam.validate(getSomethingForAntispam(req, imageId), antispamData)) {
    return res.render('error', {
      title: config.phrases.error,
      message: config.phrases.error_failed_antispam
    });
  }
  
  db.votes.cast(imageId, word, isYes ? 1 : -1, function(cast_err, cast_result) {
    res.redirect(config.http.route.vote);
  });
}

var getSomethingForAntispam = function(req, imageId) {
  return '' + imageId;
}