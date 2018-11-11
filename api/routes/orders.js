var express = require('express');
var router = express.Router();


router.get('/', function (req, res, next) {
 res.status(200).json({
  message:'Orders were fetched'
  });
});

router.post('/', function (req, res, next) {
  var order ={
    productId: req.body.productId,
    quantity: req.body.quantity
  }
 res.status(201).json({
  message:'Order was created',
  order: order
  });
});

router.post('/:orderId', function (req, res, next) {
var id =req.params.orderId;
 res.status(200).json({
  message:'Order created',
  orderId: id
  });
});

router.delete('/:orderId', function (req, res, next) {
 res.status(200).json({
  message:'Order deleted',
  orderId: req.params.orderId
  });
});

module.exports = router;
