/**
 * New node file
 */
var db = require("./db");
var userData = require("./users");

exports.singIn = function(req, res) {
//	var email = req.param("userId");
//	var password = req.param("password");
	var email = "k.praveen@outlook.com";
	var password = "kpraveen";
	console.log("Got a connection");
	var input = {
		"userId" : email,
		"password" : password
	};
	var mongo = db.mongo;
	mongo.collection("users").findOne(input, function(err, result) {
		//console.log(result);
		if (err || !result)
		{
			console.log(err);
			res.send({"error" : "Login Failed"});
		}	
		else 
		{
			//console.log(result);
			req.session.userId = email;
			req.session.modelType = result.modelType; //modified by Apoorva
			//get projects - define new API to get projects for that user
			//if there are projects load the project display page with project details along with create project option
			//if no projects - the same project details page will be loaded but empty with only create project option
			console.log(result.modelType);
			//TBD move getData to the project details page
			userData.getData({
				"modelType" : result.modelType
			}, req, res);
		}
		// mongo.close();
	});
};

exports.signOut = function(req,res){
	if(req.session){
		req.session.destroy();
	}
}
