/**
 * Module dependencies.
 */

var express = require('express')
  , login = require('./routes/login')
  , users = require('./routes/users')
  , http = require('http')
  , path = require('path');

var app = express();

//all environments
app.set('port', process.env.PORT || 2200);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.cookieParser());
app.use(express.session({ secret: 'i study', cookie: { maxAge: 60000000 }}));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.post('/signIn', login.singIn);
app.post('/signOut', login.signOut);
//app.post('/updateCardStatus', users.updateCardStatus);
//app.put('/updateTaskStatus', users.updateTaskStatus);
app.put('/addTask', users.addTask);
app.put('/addCard', users.addCard);
app.post('/removeProject', users.removeProject);
app.put('/updateUser', users.updateUser);
app.put('/createProject', users.createProject);
app.put('/updateTask', users.updateTask);
app.put('/updateCard', users.updateCard);

//app.post('/getData', login.singIn);

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
