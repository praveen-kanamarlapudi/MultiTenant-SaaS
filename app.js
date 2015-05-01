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


app.post('/signOut', login.signOut);
//app.post('/updateCardStatus', users.updateCardStatus);
//app.put('/updateTaskStatus', users.updateTaskStatus);
app.post('/addTask', users.addTask);
app.post('/addCard', users.addCard);
app.post('/addUserStory', users.addUserStory);
app.post('/removeProject', users.removeProject);
app.get('/projectStatusKanban', users.getProjectStatus);
app.get('/projectStatusWaterfall', users.getProjectStatusWaterfall);

app.put('/updateUser', users.updateUser);
app.put('/createProject', users.createProject);
app.put('/updateTask', users.updateTask);
app.post('/updateCard', users.updateCard);
app.post('/updateCardStatus', users.updateCardStatus);
app.post('/updateUserStory', users.updateUserStory);
app.put('/updateTaskStatus', users.updateTaskStatus);
app.post('/updateUserStoryStatus', users.updateUserStoryStatus);
app.post('/getCardsOnStatus', users.getCardsOnStatus);
app.post('/getTasksOnStatus', users.getTasksOnStatus);
app.post('/updateUserStorySprint', users.updateUserStorySprint);
app.get('/getTaskStatus', users.getTasksOnStatus);
app.get('/getSprints', users.getSprints);
app.post('/deleteCard',users.deleteCard);
app.post('/deleteUserstory',users.deleteUserstory);
app.post('/deleteTask',users.deleteTask);
app.post('/getWaterfallStatus', users.getWaterfallStatus);

app.get('/create',users.create);
app.get('/edit',users.edit);
app.get('/view',users.view);
app.get('/getProjects',users.getProjects);
app.post('/signIn', login.signIn);
app.get('/', login.start);
app.get('/backlog', login.backlog);

app.get('/loadCards', users.loadCards);

app.post('/selectProject', users.getData);
//app.post('/selectProject', users.temp);

//app.post('/getData', login.signIn);

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
