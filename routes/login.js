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
	var mongo = db.mongo;
	mongo.collection("users").findOne(input, function(err, result) {
		console.log(result);
		if (err || !result)
			res.send({
				"error" : "Login Failed"
			});
		else {
			console.log(result);
			req.session.userId = email;
			req.session.modelType = modelType;
			userData.getData({
				"modelType" : result.modelType
			}, req, res);
		}
		// mongo.close();
	});
}

exports.signOut = function(req,res){
	if(req.session){
		req.session.destroy();
	}
}
