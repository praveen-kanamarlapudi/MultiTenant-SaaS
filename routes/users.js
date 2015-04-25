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
		var mongo = db.mongo;
		mongo.collection("waterfall").find({
			"userId" : userId
		}).toArray(function(err, result) {
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
	} else if (model.modelType === "kanban") {
		var mongo = db.mongo;
		mongo.collection("kanban").find({
			"userId" : userId
		}).toArray(function(err, result) {
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
	} else if (model.modelType === "scrum") {
		var mongo = db.mongo;
		mongo.collection("scrum").find({
			"userId" : userId
		}).toArray(function(err, result) {
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
				} else {
					res.send({
						"Login" : "Fail",
					});
				}
			}
		});
	} else {
		res.send({
			"error" : "This new tenant not yet supported."
		});
	}

};

/**
 * Update card details for kanban
 * 
 * @param req
 * @param res
 */
exports.updateKanbanCard = function(req, res) {
	var userId = req.param("userId");
	var projectName = req.param("projectName");
	var cardId = req.param("cardId");
	var status = req.param("status");

	if (!userId || !projectName || !cardId || !status || userId === undefined
			|| projectName === undefined || cardId === undefined
			|| status === undefined) {
		res.send({
			"error" : "Unsufficient details"
		});
	}
	var mongo = db.mongo;
	mongo.collection("kanban").update({
		"userId" : userId,
		'projectName' : projectName,
		cards : {
			$elemMatch : {
				"cardId" : cardId
			}
		}
	}, {
		$set : {
			'cards.$.status' : status
		}
	}, function(err, result) {

		res.send({
			"result" : result
		});
	});
};

exports.updateWaterfallTask = function(req, res) {
	var userId = req.param("userId");
	var projectName = req.param("projectName");
	var cardId = req.param("taskId");
	var completed = req.param("completed");

	if (!userId || !projectName || !cardId || !completed
			|| userId === undefined || projectName === undefined
			|| cardId === undefined || completed === undefined) {
		res.send({
			"error" : "Unsufficient details"
		});
	}
	var mongo = db.mongo;
	mongo.collection("waterfall").update({
		"userId" : userId,
		'projectName' : projectName,
		tasks : {
			$elemMatch : {
				"taskId" : cardId
			}
		}
	}, {
		$set : {
			'tasks.$.completed' : completed
		}
	}, function(err, result) {

		res.send({
			"result" : result
		});
	});
};


