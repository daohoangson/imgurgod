var mongoskin = require('mongoskin');
var config = require('./config');

var collectionImages = null;
var collectionVotes = null;

var mongodb = mongoskin.db(config.db.mongodb_url, { safe: true }).open(function(err, db) {
  if (err) {
    console.error('mongodb is NOT connected (%s)', err.message);
    return;
  }
  
  console.log('mongodb is connected');
  
  collectionImages = mongodb.bind('images');
  exports.images.count(function(count_err, count_result) {
    console.log('mongodb.images: count = %d', count_result);
  });

  collectionVotes = mongodb.bind('votes');
  exports.votes.count(function(count_err, count_result) {
    console.log('mongodb.votes: count = %d', count_result);
  });
});

exports.images = {
  insert: function(url, callback) {
    // callback = function(err, image) {};
    if (collectionImages == null) {
      console.warn('mongodb: images collection handle is null');
      return callback(config.errors.db_images_is_null, null);
    }
    
    collectionImages.findAndModify(
      { url: url },
      [['_id', 'asc']],
      { $set: { url: url } },
      { safe: true, new: true, upsert: true },
      function(fam_err, fam_result) {
        if (fam_err) {
          console.warn('mongodb.images: fam/insert error (%s)', fam_err.message);
          return callback(config.errors.db_insert_error, null);;
        }
        
        return callback(0, fam_result);
    });
  },
  
  count: function(callback) {
    // callback = function(err, total) {};
    if (collectionImages == null) {
      console.warn('mongodb: images collection handle is null');
      return callback(config.errors.db_images_is_null, 0);
    }
    
    collectionImages.find().count(function(count_err, count_result) {
      if (count_err) {
        console.warn('mongodb.images: count error (%s)', count_err.message);
        return callback(config.errors.db_count_error, 0);;
      }
      
      return callback(0, count_result);
    });
  },
  
  getTop: function(limit, callback) {
    // callback = function(err, images) {};
    if (collectionImages == null) {
      console.warn('mongodb: images collection handle is null');
      return callback(config.errors.db_images_is_null, []);
    }
    
    boards.find({}, false, { limit: limit, sort: [['score', 'desc']] }).toArray(function(find_err, find_result) {
      if (find_err) {
        console.warn('mongodb.images: find error (%s)', find_err.message);
        return callback(config.errors.db_find_error, []);;
      }
      
      callback(0, find_result);
    });
  }
};

exports.votes = {
  cast: function(imageId, word, point, callback) {
    // callback = function(err, vote_record) {};
    if (collectionVotes == null) {
      console.warn('mongodb: votes collection handle is null');
      return callback(config.errors.db_votes_is_null, null);
    }
    
    if (typeof imageId != 'string'
      || (imageId.length != 12
      && imageId.length != 24)) {
        console.warn('mongodb: vote need a valid imageId');
        return callback(config.errors.db_vote_image_id_is_invalid, null);
    }
    
    var newVote = {
      imageId: new mongodb.ObjectID(imageId),
      word: word,
      point: point,
      timestamp: Math.floor(new Date().getTime() / 1000)
    }
    
    collectionVotes.insert(newVote, { safe: true }, function(insert_err, insert_result) {
      if (insert_err) {
        console.warn('mongodb.votes: insert error (%s)', insert_err.message);
        return callback(config.errors.db_insert_error, null);
      }
      
      return callback(0, insert_result[0]);
    });
  },
  
  count: function(callback) {
    // callback = function(err, total) {};
    if (collectionVotes == null) {
      console.warn('mongodb: votes collection handle is null');
      return callback(config.errors.db_votes_is_null, 0);
    }
    
    collectionVotes.find().count(function(count_err, count_result) {
      if (count_err) {
        console.warn('mongodb.votes: count error (%s)', count_err.message);
        return callback(config.errors.db_count_error, 0);;
      }
      
      return callback(0, count_result);
    });
  }
};