var express = require('express');
var router = express.Router();
var user = require("../models/user")

/* GET users listing. */
router.get('/add', function(req, res, next) {
  res.send('respond with a resource');
  user.addUser();
});

module.exports = router;
