/**
 * @author Praveen K
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
exports.updateCard = function(req, res) {
	var userId = req.param("userId");
	var projectName = req.param("projectName");
	var cardId = req.param("cardId");
	var status = req.param("status");

	var name = req.param("name");
	var duration = req.param("duration");
	var startDate = req.param("startDate");
	var endDate = req.param("endDate");
	var predecessors = req.param("predecessors");
	var resources = req.param("resources");
	var risks = req.param("risks");

	if (!userId || !projectName || !cardId || userId === undefined
			|| projectName === undefined || cardId === undefined) {
		res.send({
			"error" : "In Sufficient details"
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
			'cards.$.name' : name,
			'cards.$.duration' : duration,
			'cards.$.startDate' : startDate,
			'cards.$.endDate' : endDate,
			'cards.$.risks' : risks,
			'cards.$.status' : status,
			'cards.$.predecessors' : predecessors,
			'cards.$.resources' : resources
		}
	}, function(err, result) {

		res.send({
			"result" : result
		});
	});
};

/**
 * Updates task details in waterfall model
 */
exports.updateTask = function(req, res) {
	var userId = req.param("userId");
	var projectName = req.param("projectName");
	var taskId = req.param("taskId");
	var taskName = req.param("taskName");
	var duration = req.param("duration");
	var startDate = req.param("startDate");
	var endDate = req.param("endDate");
	var predecessors = req.param("predecessors");
	var resources = req.param("resources");
	var risks = req.param("risks");
	var completed = req.param("completed");

	if (!userId || !projectName || !taskId || userId === undefined
			|| projectName === undefined || taskId === undefined) {
		res.send({
			"error" : "Insufficient details"
		});
	} else {
		var mongo = db.mongo;
		mongo.collection("waterfall").update({
			"userId" : userId,
			'projectName' : projectName,
			tasks : {
				$elemMatch : {
					"taskId" : taskId
				}
			}
		}, {
			$set : {
				'tasks.$.taskName' : taskName,
				'tasks.$.duration' : duration,
				'tasks.$.startDate' : startDate,
				'tasks.$.endDate' : endDate,
				'tasks.$.risks' : risks,
				'tasks.$.predecessors' : predecessors,
				'tasks.$.resources' : resources,
				'tasks.$.completed' : completed
			}
		}, function(err, result) {

			res.send({
				"result" : result
			});
		});
	}
};

/**
 * Add task in waterfall model.
 */
exports.addTask = function(req, res) {
	var userId = req.param("userId");
	var projectName = req.param("projectName");
	var taskId = req.param("taskId");
	var taskName = req.param("taskName");
	var duration = req.param("duration");
	var startDate = req.param("startDate");
	var endDate = req.param("endDate");
	var predecessors = req.param("predecessors");
	var resources = req.param("resources");
	var risks = req.param("risks");
	var completed = req.param("completed");

	if (!userId || !projectName || !taskId || !duration || !startDate
			|| !endDate || !completed || userId === undefined
			|| projectName === undefined || taskId === undefined
			|| duration === undefined || duration === undefined
			|| startDate === undefined || endDate === undefined
			|| completed === undefined) {
		res.send({
			"error" : "Insufficient details"
		});
	} else {
		var mongo = db.mongo;

		mongo.collection('waterfall').find({
			'userId' : userId,
			'projectName' : projectName,
			tasks : {
				$elemMatch : {
					'taskId' : taskId
				}
			}
		}).toArray(function(err, results) {
			if (results.length > 0) {
				res.send({
					'error' : 'Task with given id already exists.'
				});
			} else {
				mongo.collection("waterfall").update({
					"userId" : userId,
					'projectName' : projectName,
				}, {
					$push : {
						'tasks' : {
							'taskId' : taskId,
							'taskName' : taskName,
							'duration' : duration,
							'startDate' : startDate,
							'endDate' : endDate,
							'predecessors' : predecessors,
							'resources' : resources,
							'risks' : risks,
							'completed' : completed
						}
					}
				}, function(err, result) {

					res.send({
						"result" : result
					});
				});
			}
		});

	}
};

/**
 * Add task in waterfall model.
 */
exports.addCard = function(req, res) {
	var userId = req.param("userId");
	var projectName = req.param("projectName");
	var cardId = req.param("cardId");
	var name = req.param("name");
	var duration = req.param("duration");
	var startDate = req.param("startDate");
	var endDate = req.param("endDate");
	var predecessors = req.param("predecessors");
	var resources = req.param("resources");
	var risks = req.param("risks");
	var status = req.param("status");

	if (!userId || !projectName || !cardId || !duration || !startDate
			|| !endDate || !status || userId === undefined
			|| projectName === undefined || cardId === undefined
			|| duration === undefined || startDate === undefined
			|| endDate === undefined || status === undefined) {
		res.send({
			"error" : "Insufficient details"
		});
	} else {
		var mongo = db.mongo;
		mongo.collection('kanban').find({
			'userId' : userId,
			'projectName' : projectName,
			cards : {
				$elemMatch : {
					'cardId' : cardId
				}
			}
		}).toArray(function(err, results) {
			if (results.length > 0) {
				res.send({
					'error' : 'Card with given id already exists.'
				});
			} else {
				mongo.collection("kanban").update({
					"userId" : userId,
					'projectName' : projectName,
				}, {
					$push : {
						'cards' : {
							'cardId' : cardId,
							'name' : name,
							'duration' : duration,
							'startDate' : startDate,
							'endDate' : endDate,
							'predecessors' : predecessors,
							'resources' : resources,
							'risks' : risks,
							'status' : status
						}
					}
				}, function(err, result) {

					res.send({
						"result" : result
					});
				});
			}
		});

	}
};
/**
 * Removes project from any type of tenant.
 */
exports.removeProject = function(req, res) {
	var userId = req.param("userId");
	var projectName = req.param("projectName");
	var modelType = req.param("modelType");

	var mongo = db.mongo;
	mongo.collection(modelType).remove({
		'userId' : userId,
		'projectName' : projectName
	}, function(err, results) {
		res.send({
			'results' : results
		});
	});
}

/**
 * Updates user details.
 */
exports.updateUser = function(req, res) {
	var userId = req.param("userId");
	var modelType = req.param("modelType");
	var firstName = req.param("firstName");
	var lastName = req.param("lastName");

	if (!userId || !modelType || !firstName || !lastName
			|| userId === undefined || modelType === undefined
			|| firstName === undefined || lastName === undefined) {
		res.send({
			"error" : "In sufficient data"
		});
	} else {
		var mongo = db.mongo;
		mongo.collection("users").update({
			'userId' : userId
		}, {
			$set : {
				'firstName' : firstName,
				'lastName' : lastName,
				'modelType' : modelType
			}
		}, function(err, result) {
			res.send({
				'result' : result
			});
		});
	}
}

/**
 * Creates a project of tenant type.
 */
exports.createProject = function(req, res) {
	var userId = req.param('userId');
	var projectName = req.param('projectName');
	var projectDescription = req.param('projectDescription');
	var modelType = req.param('modelType');
	var taskType;
	if (modelType === 'waterfall') {
		taskType = 'tasks';
	} else if (modelType === 'scrum') {
		taskType = 'userStiries';
	} else if (modelType === 'kanban') {
		taskType = 'cards';
	}
	var mongo = db.mongo;
	mongo.collection(modelType).insert({
		'userId' : userId,
		'modelType' : modelType,
		'projectName' : projectName,
		'projectDescription' : projectDescription,
		taskType : []
	}, function(err, results) {
		res.send("results", results);
	});
}
