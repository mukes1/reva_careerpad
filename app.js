const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const sass = require('node-sass-middleware');



const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register'); 
const companiesRouter = require('./routes/companies');
const profileRouter = require('./routes/profile');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//sass middleware setup
app.use(sassMiddleware({
         src: __dirname + '/public/sass', 
         dest: __dirname + '/public/stylesheets',
         debug: true,
         outputStyle: 'expanded',
         prefix: '/stylesheets'
}));


//database
mongoose.Promise = global.Promise;
try{
  mongoose.connect("mongodb://localhost:27017/careerpad", { useNewUrlParser: true });
 
}catch(err){
 console.log(err);
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(session({
  cookie: { maxAge: 60000 },
  secret: 'codeworkrsecret',
  saveUninitialized: false,
  resave: false
}));
app.use(express.static(path.join(__dirname, 'public')));

//passport config
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
  res.locals.success_mesages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  next()
})

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/companies', companiesRouter);
app.use('/profile', profileRouter);


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
