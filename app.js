
const express      = require('express');
const path         = require('path');
const cookieParser = require('cookie-parser');
const ejs          = require('ejs');
const bodyParser   = require('body-parser');
const logger       = require('morgan');
const session      = require('express-session');
const fileupload   = require('express-fileupload');
const fs           = require('fs');

/**
 * user defined modules
 * routers
 */
const indexRouter  = require('./routes/base');
const usersRouter  = require('./routes/users');
const postsRouter  = require('./routes/post');
const setupsRouter = require('./routes/setup');
const requestRouter = require('./routes/request');
const apiRouter    = require('./routes/api');
const ajaxRouter   = require('./routes/ajax');
const groupRouter  = require('./routes/group');
const messageRouter= require('./routes/messages');
const blogRouter   = require('./routes/blog');

/**
 * user defined modules
 * models
 */


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(fileupload());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'max', saveUninitialized: false, resave: false}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/post', postsRouter);
app.use('/setup', setupsRouter);
app.use('/request', requestRouter);
app.use('/api', apiRouter);
app.use('/ajax', ajaxRouter);
app.use('/group', groupRouter);
app.use('/messages', messageRouter);
app.use('/blog', blogRouter);

//catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  next();
});
module.exports = app;
