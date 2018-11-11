var express = require('express');
var app = express();
var morgan = require ('morgan');
var bodyParser = require ('body-parser');
var url = 'mongodb://localhost:27017/';

var productRoutes = require('./api/routes/products');
var orderRoutes = require('./api/routes/orders');

var mongoose =require ('mongoose');

mongoose.connect(url);
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin","*");
  res.header(
    "Access-Control-Allow-Header", "Origin,X-Requested-With, Content-Type,Accept, Authorization"
  );
  if (req.method === 'OPTIONS') {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET")
    return res.status(200).json({});
  }
  next();
});

app.use('/products',productRoutes);
app.use('/orders',orderRoutes);

app.use(function(req, res, next)  {
  var error = new Error('Not found');
  error.status =404;
  next(error);
});

app.use(function(error, req, res, next){
  res.status(error.status || 500);
  res.json ({
    error:{
      message: error.message
    }
  });
});

module.exports = app;
