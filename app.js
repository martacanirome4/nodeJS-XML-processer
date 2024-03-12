// app.js: archivo principal de la aplicación
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const axios = require('axios');
const xml2js = require('xml2js');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Agregamos el middleware para procesar el nuevo tipo de XML
app.use('/xml', fetchXML, require('./routes/xml'));

// Middleware para procesar el nuevo tipo de XML
async function fetchXML(req, res, next) {
    if (req.query.url) {
      const url = req.query.url;
      try {
        const resData = await axios.get(url);
        // Parseamos el XML a JSON
        xml2js.parseString(resData.data, (err, result) => {
          if (err) {
            console.error('Error parsing XML:', err);
            res.status(500).send('Error parsing XML');
          } else {
            req.xmlData = result; // Guardamos los datos del XML en req.xmlData
            next();
          }
        });
      } catch (error) {
        console.error('Error fetching XML:', error);
        res.status(500).send('Error fetching XML');
      }
    } else {
      res.status(400).send('URL parameter is missing');
    }
  }

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
