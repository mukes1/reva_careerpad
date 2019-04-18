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
const config = require('./config/index');
const MongoDBStore = require('connect-mongodb-session')(session);


const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const profileRouter = require('./routes/profile');
const companiesRouter = require('./routes/companies');

const app = express();


//session storage
const store = new MongoDBStore({
  uri: config.mongoUrl,
  collection: 'sessions'
});

//catch session sotre errors
store.on('error', (err)=>{
  console.log(err);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//sass middleware setup
app.use(sassMiddleware({
  src: __dirname + '/public/sass',
  dest: __dirname + '/public/stylesheets',
  debug: true,
  outputStyle: 'compressed',
  prefix: '/stylesheets'
}));


//database
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUrl, {
  useNewUrlParser: true
}, (err) => {
  if(err){
  console.log("Database Connection Error!!");
  }else{
    console.log('Successfully connected to database');
  }
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser());

//sass configuration
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));

app.use(express.static(path.join(__dirname, 'public')));

//session config
app.use(session({
  name: 'sid',
  secret: 'codeworkrsecret',
  cookie: {
    maxAge: 60000,
    sameSite: true
  },
  store: store,
  saveUninitialized: false,
  resave: false
}));

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
app.use(loginRouter);
app.use(registerRouter);
app.use(companiesRouter);
app.use(profileRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;