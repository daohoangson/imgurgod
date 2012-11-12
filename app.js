
/**
 * Module dependencies.
 */

var express = require('express')
  , expressExpose = require('express-expose')
  , http = require('http')
  , path = require('path');

var app = express();
var db = require('./db');
var config = require('./config');

app.configure(function(){
  app.expose({ config: config });
  app.set('config', config);
  
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get(config.http.route.vote, require('./routes').index);
app.post(config.http.route.submit, require('./routes').submit);
app.get(config.http.route.top, require('./routes/list').top);

http.createServer(app).listen(config.http.port, function(){
  console.log("Express server listening on port " + config.http.port);
});
