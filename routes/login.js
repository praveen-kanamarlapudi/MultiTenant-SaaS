/**
 * New node file
 */
var db = require("./db");
exports.singIn = function(req, res) {
	var email = req.param("email");
	var password = req.param("password");
	console.log("Got a connection");
	var input = {
		"emailId" : email,
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
			if (result.length > 0)
				res.send({
					"Login" : "Success"
				});
			else
				res.send({
					"Login" : "Fail",
					"tasks" : ["1","2",3]
					
				});
		}
		mongo.close();
	});
}

