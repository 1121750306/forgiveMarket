var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log("2222222222222");
  //res.render('index', { title: 'Express' });
  res.redirect("/views/homepage.html");
});

module.exports = router;
