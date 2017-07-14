var express = require('express');
var router = express.Router();
var user = require("../models/user")

//注册models监听并传递models
function callback(models) {
	user.initModel(models);
}

//购物车
router.get('/', function(req, res, next) {
	console.log("cart router get");
  	res.render("order/shoppingcart");
});

module.exports = router;
module.exports.callback = callback;