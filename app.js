const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mysql = require('mysql');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');



const app = express();

const db = mysql.createConnection({
      host: 'localhost',
      user: 'root', // user of your database
      password: '', // password of your database
      database: 'timelapser_app3',
      port: 3306
    });

db.connect((err) => {
  if(err){
    throw err;
  }
  console.log('Connected to database');
});

global.db = db;


var session = require('express-session');
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60000
  }
}))



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json()); 
// parse form data client
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());


//routes for apps
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const projectRouter = require('./routes/project');
app.get('/', indexRouter.index); //call for main index page
app.get('/login', indexRouter.index); //call for login page
app.get('/signup', usersRouter.signup); //call for signup page
app.post('/login', usersRouter.login); //call for login post
app.post('/signup', usersRouter.signup); //call for signup post
app.get('/logout', usersRouter.logout)// call for loggout get
app.get('/:username/profile', usersRouter.getUserData);//get user data
app.post('/:username/profile', usersRouter.postUserData);// post user data
app.get('/:username/project/all', projectRouter.projectPage);// call for all project page
app.get('/:username/project/:projectId/update/:detailId', projectRouter.getUpdatePage);
app.post('/:username/project/:projectId/update/:detailId', projectRouter.postUpdatePage);
app.get('/:username/project/create', projectRouter.getCreatePage);
app.post('/:username/project/create', projectRouter.postCreatePage);
app.get('/:username/project/delete/:projectId', projectRouter.deletepage);
//tasks routes
const taskRouter = require('./routes/task');
app.get('/:username/project/:projectId/task/all', taskRouter.taskPage); // call for all project page
app.get('/:username/project/:projectId/task/:taskId/update/:detailId', taskRouter.getUpdatePage);
app.post('/:username/project/:projectId/task/:taskId/update/:detailId', taskRouter.postUpdatePage);
app.get('/:username/project/:projectId/task/create', taskRouter.getCreatePage);
app.post('/:username/project/:projectId/task/create', taskRouter.postCreatePage);
app.get('/:username/project/:projectId/task/:taskId/delete/:detailId', taskRouter.deletepage);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
