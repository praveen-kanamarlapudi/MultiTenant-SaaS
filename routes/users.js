/**
 * Made some changes
 */

var db = require("./db");

/**
 * Gets user project data depending on user tenant type
 */
exports.getData = function(model, req, res) {
	var userId = req.param("userId");
	console.log(model);
	if (!model || model === undefined)
		res
				.send({
					"error" : "Something went wrong. User data doesn't contain any tenant type."
				});
	if (model.modelType === "waterfall") {
		var mongo = db.mongo([ "waterfall" ]);
		mongo.waterfall.find({
			"userId" : userId
		}, function(err, result) {
			if (err || !result)
				res.send({
					"error" : "Something went wrong"
				});
			else {
				console.log(result);
				if (result.length > 0) {
					var proj = "projectNaame";
					console.log(result.$proj);
					res.send(result);
				} else
					res.send({
						"Login" : "Fail",
					});
			}
		});
	} else if (model.modelType === "kanbon") {

	} else if (model.modelType === "scrum") {

	} else {
		res.send({
			"error" : "This new tenant not yet supported."
		});
	}

}

/**
 * Fetches waterfall tenant type data
 * 
 * @param req
 * @param res
 */
function getWaterFallData(req, res) {

}