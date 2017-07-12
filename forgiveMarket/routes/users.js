var express = require('express');
var router = express.Router();
var user = require("../models/user")

//注册models监听并传递models
function callback(models) {
	user.initModel(models);
}

/* GET users listing. */
router.get('/add', function(req, res, next) {
	user.addUser();
	res.send('respond with a resource');
});


module.exports = router;
module.exports.callback = callback;