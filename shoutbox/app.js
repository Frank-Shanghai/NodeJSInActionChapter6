const entries = require('./routes/entries');
const session = require('express-session'); // Related implementation not included in Chapter 6
const validate = require('./middleware/validate');
const messages = require('./middleware/messages'); // Related implementation not included in Chapter 6
const register = require('./routes/register');
const login = require('./routes/login');
const user = require('./middleware/user');
const api = require('./routes/api');
const Entry = require('./models/entry');
const page = require('./middleware/page');

//var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

//var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(messages);
app.use('/api', api.auth);
app.use(user);

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

app.get('/', entries.list);
app.get('/post', entries.form);

// Actually these 2 routers are duplicate
app.post('/post', 
      validate.required('entry[title]'),
      validate.lengthAbove('entry[body]', 4),
      entries.submit);
app.post('/api/entry', entries.submit);

app.get('/register', register.form);
app.post('/register', register.submit);
app.get('/login', login.form);
app.post('/login', login.submit);
app.get('/logout', login.logout);
app.get('/api/user/:id', api.user);
app.get('/api/entries/:page?', page(Entry.count), api.entries);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err=new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
