exports.errors = {
  db_images_is_null: 10001,
  db_votes_is_null: 10002,
  db_redis_is_null: 10003,
  
  db_count_error: 20001,
  db_find_error: 20002,
  db_insert_error: 20002,
  
  db_vote_image_id_is_invalid: 32001
};

exports.db = {
  mongodb_url: process.env.MONGOHQ_URL || '127.0.0.1:27017/imgurgod',
  redis_url: process.env.REDISTOGO_URL || 'redis://127.0.0.1:6379'
}

exports.http = {
  port: process.env.PORT || 3000,
  route: {
    vote: '/',
    submit: '/submit',
    top: '/list/top'
  }
}

exports.phrases = {
  title: 'Is it?',
  question: 'Does this image have anything to do with "%s"?',
  yes: 'Yes',
  no: 'No',
  
  error: 'Error',
  error_incomplete_data: 'Incomplete data submitted. Are you doing something fishy?',
  error_failed_antispam: 'Your request could not pass our anti spam filter, can you please try again? I\'m begging...'
}