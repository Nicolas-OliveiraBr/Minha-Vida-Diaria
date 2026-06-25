require('dotenv').config();
var mongoose = require('mongoose'); // importando biblioteca Mongoose
var session = require('express-session'); // Importando o express-session
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Conexão com o banco de dados, coletando a string connection do arquivo .env
mongoose.connect(process.env.DB)
  .then(() => console.log('MongoDB conectado!'))
  .catch((err) => console.error('Erro ao conectar MongoDB:', err));

// Configuração do sistema de cookies que o site usa para registrar informações do usuário

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const postsRouter = require('./routes/posts');

var app = express();

// Configurando algumas propriedades dos cookies utilizados pelo express-session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/posts', postsRouter);

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
