/**
 * New node file
 */
var db = require("./db");
var userData = require("./users");

exports.start = function(req, res){
	res.render('homepage');
}

exports.signUp = function(req,res) {
	var email = req.param("email");
    var password = req.param("password");
	var firstname = req.param("firstname");
    var lastname = req.param("lastname");
	var modeltype = req.param("modeltype");
	
	console.log("signup data is " + firstname + lastname + email + password + modeltype);
	if(email !== null && password !== null && firstname !== null &&
	  lastname !== null && modeltype !== null && email !== undefined &&
	  password !== undefined && firstname !== undefined && lastname !== undefined && modeltype !== undefined)
	{
		var input = {firstName:firstname,
				     lastName:lastname,
				     userId:email,
				     password:password,
				     modelType:modeltype};
			var mongo = db.mongo;
			mongo.collection("users").insert(input, function(err, result) {
				console.log(result);
				if (err || !result)
				{
					console.log(err);
					res.send({"status" : "SignUp Failed"});
				}
				else 
				{
					console.log("user signup success");
					res.send({"status" : "Success"});
				}
			});
	}
};

exports.signIn = function(req, res) {
	
	var email = req.param("email");
    var password = req.param("password");
	
//	var email = "100";
//	var password = "kpraveen";
    
	console.log("Got a connection");
	var input = {
		"userId" : email,
		"password" : password
	};
	var mongo = db.mongo;
	console.log(input);
	mongo.collection("users").findOne(input, function(err, result) {
		console.log(result);
		if (err || !result)
		{
			console.log(err);
			res.send({"error" : "Login Failed"});
		}
		else 
		{
			console.log('Login success..');
			console.log(result);
			req.session.userId = email;
			req.session.modelType = result.modelType; //modified by Apoorva
			//get projects - define new API to get projects for that user
			//if there are projects load the project display page with project details along with create project option
			//if no projects - the same project details page will be loaded but empty with only create project option
			console.log(result.modelType);
			res.send({'status':'Success'});
			//TBD move getData to the project details page
//			userData.getData({
//				"modelType" : result.modelType
//			}, req, res);
		}
		// mongo.close();
	});
};

exports.backlog = function(req, res){
	res.render('backlog');
}

exports.signOut = function(req,res){
	if(req.session){
		req.session.destroy();
	}
}
