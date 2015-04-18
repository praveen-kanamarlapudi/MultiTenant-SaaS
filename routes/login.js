/**
 * New node file
 */
var db = require("./db");
var userData = require("./users");
exports.singIn = function(req, res) {
	var email = req.param("userId");
	var password = req.param("password");
	console.log("Got a connection");
	var input = {
		"userId" : email,
		"password" : password
	};
	var mongo = db.mongo([ "users" ]);
	mongo.users.find(input, function(err, result) {
		console.log(result);
		if (err || !result)
			res.send({
				"error" : "Something went wrong"
			});
		else {
			console.log(result);
			if (result.length > 0) {
				userData.getData({
					"modelType" : result[0].modelType
				}, req, res);
			} else
				res.send({
					"Login" : "Fail",
				});
		}
		mongo.close();
	});
}
