/**
 * @author Praveen K
 */

var db = require("./db");

/**
 * Gets user project data depending on user tenant type
 */
function getCards(project,req,res)
{
	var mongo       = db.mongo;
	//var userId      = req.param("userId");
	//var projectName = project.projectName;
	var userId = "g.apoorvareddy@gmail.com";
	var projectName = "Testing Project";
	
	console.log("get card for " + userId);
	mongo.collection("kanban").find({
		"userId" : userId,
		'projectName' : projectName}).toArray(function(err, result) 
	{
		if (err || !result)
		{
			res.send({"error" : "Something went wrong"});
		}	
		else 
		{
			console.log(result);
			var firstData = [], secondData = [], thirdData = [], fourthData = [], fifthData = [];
			if (result.length > 0) {
				var cards = result[0].cards;
				for(var i = 0; i < cards.length ; i++)
				{
					if(cards[i].status === null || cards[i].status === undefined)
					{
						firstData.push(cards[i]);
					}
					else if(cards[i].status === "Ready for Dev")
					{
						secondData.push(cards[i]);
					}
					else if(cards[i].status === "In progress")
					{
						thirdData.push(cards[i]);
					}
					else if(cards[i].status === "Testing")
					{
						fourthData.push(cards[i]);
					}
					else if(cards[i].status === "Finished")
					{
						fifthData.push(cards[i]);
					}
				}
			}
			res.render('index', { title: 'Express'
				                , firstdata:firstData
				                , seconddata:secondData 
				                , thirddata:thirdData 
				                , forthdata:fourthData 
				                , fifthdata:fifthData });
		}
	});
}

exports.getData = function(model, req, res) 
{
	
	console.log('Getting user data from db');
	//var userId = req.param("userId");
//	var userId = "g.apoorvareddy@gmail.com";
	var userId = "k.praveen@outlook.com";
	//console.log(model);
	if (!model || model === undefined)
	{
		res.send({"error" : "Something went wrong. User data doesn't contain any tenant type."});
	}
	else if (model.modelType === "waterfall") 
	{
		var mongo = db.mongo;
		mongo.collection("waterfall").find({"userId" : userId}).toArray(function(err, result) {
			if (err || !result)
			{
				res.send({"error" : "Something went wrong"});
			}
			else 
			{
				console.log(result);
				if (result.length > 0) 
				{
					console.log('Got data from db..');
					console.log(result);
					res.send(result);
//					res.render('view',{'data':result});s
				} 
				else
				{
					res.send({"Login" : "Fail",});
				}
			}
		});
	} 
	else if (model.modelType === "kanban") 
	{
		var mongo = db.mongo;
		mongo.collection("kanban").find({"userId" : userId}).toArray(function(err, result) 
		{
			if (err || !result)
			{
				res.send({"error" : "Something went wrong"});
			}	
			else 
			{
				console.log(result);
				//load kanban project view in getCards function
				getCards({"projectName" : result.projectName}, req, res);
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



exports.getTasksOnStatus = function(req,res){
	var mongo = db.mongo;
	var userId = req.param("userId");
	var projectName = req.param("projectName");
	var completed = req.param("completed");
	
	mongo.collection("waterfall").find({
		"userId" : userId,
		'projectName' : projectName},
		{
			tasks:{
				 $elemMatch : {
			            'completed' : completed
			        }
			}
		
	}).toArray(function(err, result) {
		if (err || !result)
			res.send({
				"error" : "Something went wrong"
			});
		else {
			console.log(result);
			if (result.length > 0) {
				var proj = "projectNaame";
				console.log(result);
				res.send(result[0].cards);
			} else
				res.send({
					"Error" : "No records in requested status",
				});
		}
	});
	
}

/**
 * Update card details for kanban
 * 
 * @param req
 * @param res
 */
exports.updateCard = function(req, res) {
//	var userId = req.param("userId");
//	var projectName = req.param("projectName");
	var userId = "g.apoorvareddy@gmail.com";
	var projectName = "Testing Project";
	
	var cardId = req.param("cardId");
	var description = req.param("editedDescription");
	var startDate = req.param("plannedStart");
	var endDate = req.param("plannedFinish");
	var comments = req.param("comments");
	var resources = req.param("resources");
	var teamSize = req.param("teamSize");
	var priority = req.param("priority");

	console.log(cardId);
	console.log(description);
	console.log(startDate);
	console.log(endDate);
	console.log(comments);
	console.log(resources);
	console.log(teamSize);
	console.log(priority);
	
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
			
			'cards.$.description': description,
			'cards.$.startDate' : startDate,
			'cards.$.endDate' : endDate,
			'cards.$.teamSize' : teamSize,
			'cards.$.comments' : comments,
			'cards.$.resources' : resources,
			'cards.$.priority':priority
		}
	}, function(err, result) {

		//console.log(err);
		//console.log(result);
		res.send({
			"result" : result
		});
	});
};


/**
 * Update card details for kanban
 * 
 * @param req
 * @param res
 */
exports.updateCardStatus = function(req, res) {
//	var userId = req.param("userId");
//	var projectName = req.param("projectName");
	var userId = "g.apoorvareddy@gmail.com";
	var projectName = "Testing Project";
	
	var cardId = req.param("cardId");
	var column = req.param("status");

	var status = null;
	if(column === "secondcol")
	{
		status = "Ready for Dev";
	}
	else if(column === "thirdcol")
	{
		status = "In progress";
	}
	else if(column === "forthcol")
	{
		status = "Testing";
	}
	else if(column === "fifthcol")
	{
		status = "Finished";
	}
	if (!userId || !projectName || !cardId || userId === undefined || 
		projectName === undefined || cardId === undefined || status === undefined) {
		res.send({"error" : "In Sufficient details"});
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
			'cards.$.status' : status,
		}
	}, function(err, result) {

		if(err)
		{
			console.log("failed");
			res.send({"error" : "failed to move card!"});
		}
		else
		{
			console.log("success");
			res.send({"success" : "success"});
		}
		
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
 * Updates task details in waterfall model
 */
exports.updateTaskStatus = function(req, res) {
	var userId = req.param("userId");
	var projectName = req.param("projectName");
	var taskId = req.param("taskId");
	var completed = req.param("completed");

	if (!userId || !projectName || !taskId || !completed || userId === undefined
			|| projectName === undefined || taskId === undefined || completed === undefined) {
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
//	var userId = req.param("userId");
//	var projectName = req.param("projectName");
	
	var userId = "g.apoorvareddy@gmail.com";
	var projectName = "Testing Project";
	
	var cardId = req.param("cardId");
	var name = req.param("cardName");
	var description = req.param("carddescription");

	if (!userId || !projectName || !cardId || !description ||!name||
			userId === undefined || projectName === undefined||
			cardId === undefined || description === undefined) 
	{
		res.send({"error" : "Insufficient details"});
	} 
	else 
	{
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
				console.log("element already found");
				res.send({
					"error" : "Card with given id already exists."
				});
			} 
			else
			{
				console.log("no elemnts found adding new");
				mongo.collection("kanban").update({
					"userId" : userId,
					'projectName' : projectName,
				}, {
					$push : {
						'cards' : {
							'cardId' : cardId,
							'name' : name,
							'description' : description,
						}
					}
				}, function(err, result) {
					if(err)
					{
						console.log(err);
						res.send({"error" : result});
					}
					else
					{
						console.log("success DB update");
						res.send({"success" : result});
					}
					
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

exports.create = function(req,res){
	res.render('create');
}
exports.edit = function(req,res){
	res.render('edit');
}
exports.view = function(req,res){
	res.render('view');
}

/**
 * @TODO 1. Add Card validations  
 * 2.Update status seperate API
 * 3. Project status --> each status type and curresponding no of cards.
 * 4. getCard details based on card status type. (each card type and array of card deatils.)
 * 
 * 
 */
