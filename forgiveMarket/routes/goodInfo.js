var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var good = require("../models/good");
var goodtype = require("../models/goodtype");
var goodInfo = require("../models/goodInfo");
var goodsize = require("../models/goodsize");

function callback(models) {
	good.initModel(models);
	goodtype.initModel(models);
	goodInfo.initModel(models);
	goodsize.initModel(models);
}

router.get("/", function(req, res, next) {
	//	goodInfo.getGoodSize(mongoose.Types.ObjectId("596d6258bc42ff1430576e08"),function(err,docs){
	//		console.log(err);
	//		console.log(docs)
	//	})
	goodInfo.getGoodInfoId(mongoose.Types.ObjectId("596d6258bc42ff1430576e08"), function(err0, docs0) {
		
		goodInfo.getGoodInfo(mongoose.Types.ObjectId(docs0[0]._id), function(err, docs) {
			console.log(err);
			console.log(docs);
			goodInfo.getGoodSize(mongoose.Types.ObjectId(docs[0].gid._id), function(err2, docs2) {
				console.log("err" + err2)
				console.log("aaa" + docs2);
				res.send([docs, docs2])
			})
		})
	})

})

router.get("/:gid", function(req, res, next) {
	//	goodInfo.getGoodSize(mongoose.Types.ObjectId("596d6258bc42ff1430576e08"),function(err,docs){
	//		console.log(err);
	//		console.log(docs)
	//	})
	var gid = req.params.gid;
	goodInfo.getGoodInfoId(mongoose.Types.ObjectId(gid), function(err0, docs0) {
		
		goodInfo.getGoodInfo(mongoose.Types.ObjectId(docs0[0]._id), function(err, docs) {
			console.log(err);
			console.log(docs);
			goodInfo.getGoodSize(mongoose.Types.ObjectId(docs[0].gid._id), function(err2, docs2) {
				console.log("err" + err2)
				console.log("aaa" + docs2);
				res.send({'info':docs, 'type':docs2})
			})
		})
	})

})

module.exports = router;
module.exports.callback = callback;