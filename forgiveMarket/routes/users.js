var express = require('express');
var router = express.Router();
var user = require("../models/user")

/* GET users listing. */
router.get('/add', function(req, res, next) {
	user.addUser();
	res.send('respond with a resource');
});

module.exports = router;

function callback(data) {
	user.callback(data);
}

module.exports.callback = callback;