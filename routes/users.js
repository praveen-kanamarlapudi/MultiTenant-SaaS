/**
 * Made some changes
 */

var db = require("./db");

exports.getData = function(req, res) {
	var userId = req.param("userId");
	var mongo = db.mongo([ "waterfall" ]);

	db.find({
		"userId" : userId
	}, function(err, result) {
		
	});

}