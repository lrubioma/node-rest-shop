var express = require('express');
var router = express.Router();
var Product = require ('../models/product');
var mongoose = require ('mongoose');

router.get('/', function(req,res,next){
Product.find()
.select('name price _id')
//.where({'price':'50'})
//.limit(2)
.exec()
.then(function(docs){

  var response = {
    count: docs.length,
    products: docs.map (function(doc){
      return {
        name: doc.name,
        price: doc.price,
        _id: doc._id,
        request: {
          type: 'GET',
          url: 'http://EC2_HOME:3000/products/' + doc._id
        }
      }
    })
  }
  //if (docs.length >=0) {
  res.status(200).json(response);
  //}else{
  //  res.status(404).json(message: 'No entries found')
  //}
  })
.catch(function(err){
  console.log(err);
  res.status(500).json({
    error:err
  })
  });
});

router.post('/', function(req,res,next){

var product = new Product ({
  _id: new mongoose.Types.ObjectId(),
  name:req.body.name,
  price:req.body.price
});

product
.save()
.then(function(result){
  console.log(result);
  res.status(201).json({
    message: 'Created product',
    createdProduct:{
      name: result.name,
      price: result.price,
      _id:result._id,
      request: {
        type: 'GET',
        url: 'http://EC2_HOME:3000/products/' + result._id
      }
    }
    });
})
.catch(function(err) {
  console.log(err);
  res.status(500).json({
    error:err
  })
});


});

router.get('/:productId', function (req, res, next) {
  var id =req.params.productId;
 Product.findById(id)
 .select ('name price _id')
 .exec()
 .then(function(doc){
   console.log("From Database",doc);
   if (doc){
     res.status(200).json({
       name: doc.name,
       price: doc.price,
       _id: doc._id,
       request:{
         type:'GET',
         url: 'http://EC2_HOME:3000/products/'+id
       }
     });
   } else {
   res.status(404).json({
     message: 'Not valid entry found for provided id',
     id: id
   });
 }
 })
 .catch(function(err){
   console.log(err);
   res.status(500).json({
     error: err
   });
 });
});

router.patch('/:productId', function (req, res, next) {
var id = req.params.productId;
var updateOps = {};
for (var ops of req.body) {
  updateOps[ops.propName] = ops.value;
}
Product.update({_id: id}, {$set: updateOps })
  .exec()
  .then(function(result){
    res.status(200).json({
      request:{
        type:'GET',
        url: 'http://EC2_HOME:3000/products/'+id
      }
    });
  })
  .catch(function (err){
    console.log(err);
    res.status(500).json({
      error: err
    })
  });
});

router.delete('/:productId', function (req, res, next) {
var id = req.params.productId;
Product.remove({'_id': id})
.exec()
.then(function(result){
  res.status(200).json({
    message:'product deleted',
    request:{
      type:'POST',
      body: {
        name:'String',
        price:'Number'
      }
    }
  })
})
.catch(function(err){
  console.log(err);
  res.status(500).json({error: err})
})

;
});

module.exports = router;
