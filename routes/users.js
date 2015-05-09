/**
 * @author Praveen K
 */

var db = require("./db");
var login = require('./login');

var projectStatus;
var firstData = [], secondData = [], thirdData = [], fourthData = [], fifthData = [];
var taskStatusData = [], taskStatusIDs = [], taskStatusCompleted = [];
var points = [];

/**
 * Gets user project data depending on user tenant type
 */
function getCards(result, req, res) {
	var mongo = db.mongo;
	var userId = req.session.userId;
	var projectName = req.param("projectName");
	firstData = [], secondData = [], thirdData = [], fourthData = [],
			fifthData = [];
	if (result.length > 0) {
		var cards = result[0].cards;
		for (var i = 0; i < cards.length; i++) {
			if (cards[i].status === null || cards[i].status === undefined) {
				firstData.push(cards[i]);
			} else if (cards[i].status === "Ready for Dev") {
				secondData.push(cards[i]);
			} else if (cards[i].status === "In progress") {
				thirdData.push(cards[i]);
			} else if (cards[i].status === "Testing") {
				fourthData.push(cards[i]);
			} else if (cards[i].status === "Finished") {
				fifthData.push(cards[i]);
			}
		}
	}

	console.log('AL  data.. ' + JSON.stringify({
		title : 'Express',
		firstdata : firstData,
		seconddata : secondData,
		thirddata : thirdData,
		forthdata : fourthData,
		fifthdata : fifthData
	}));
	res.send({
		"modelType" : "kanban"
	});
}

exports.getProjectStatusWaterfall = function(req, res) {
	console.log("got project status" + taskStatusData);
	var total = 0;
	for (var i = taskStatusCompleted.length - 1; i >= 0; i--) {
		total += taskStatusCompleted[i];
	};
	total = total/taskStatusCompleted.length;
	res.render('waterfallgraph', { title: 'Waterfall Status Graph', taskIDs:taskStatusIDs, status: taskStatusCompleted, avg : total});
};

exports.getProjectStatusScrum = function(req, res) {
	console.log("got project status" + points);
	res.render('scrumgraph', {
		title : 'Scrum Status Graph',
		status1 : points
	});
};

exports.getScrumStatus = function(req, res) {
	var mongo = db.mongo;
	var userId = req.session.userId;
	var projectName = req.session.projectName;
	mongo.collection("scrum").find({
		"userId" : userId,
		'projectName' : projectName
	}).toArray(function(err, result) {
		if (err || !result) {
			res.send({
				"error" : "Something went wrong",
				"status" : "Failed"
			});
		} else {
			console.log(result);
			if (result!='null') {
				points = result[0].points;
				console.log(points);
			}
			res.send({
				"status" : "success"
			});
		}
	});
};

exports.getWaterfallStatus = function(req, res) {
	var mongo       = db.mongo;
	var userId = req.session.userId;
	var projectName = req.session.projectName;
	mongo.collection("waterfall").find({
		"userId" : userId,
		'projectName' : projectName}).toArray(function(err, result) 
	{
		if (err || !result)
		{
			res.send({"error" : "Something went wrong",
				      "status": "Failed"});
		}	
		else 
		{
			console.log(result);
			taskStatusData = [], taskStatusIDs = [], taskStatusCompleted = [];
			if (result.length > 0) 
			{
				var tasks = result[0].tasks;
				for(var i =0 ; i < tasks.length; i++)
				{
					taskStatusIDs.push(tasks[i].taskId);
					taskStatusCompleted.push(tasks[i].completed);
				}
							
			}
			res.send({"status": "success"});
		}
	});
};

exports.getProjectStatus = function(req, res) {
	console.log("got project status" + projectStatus.testingcount);
	res.render('kanbangraph', {
		title : 'Kanban Status Graph',
		status : projectStatus
	});
};

exports.getCardsOnStatus = function(req, res) {
	var mongo = db.mongo;
	var userId = req.session.userId;
	var projectName = req.session.projectName;
	console.log("project name is " + projectName);
	mongo
			.collection("kanban")
			.find({
				"userId" : userId,
				'projectName' : projectName
			})
			.toArray(
					function(err, result) {
						if (err || !result) {
							res.send({
								"error" : "Something went wrong"
							});
						} else {
							console.log(result);
							var firstData = [], secondData = [], thirdData = [], fourthData = [], fifthData = [];
							if (result.length > 0) {
								var cards = result[0].cards;
								for (var i = 0; i < cards.length; i++) {
									if (cards[i].status === null
											|| cards[i].status === undefined) {
										firstData.push(cards[i]);
									} else if (cards[i].status === "Ready for Dev") {
										secondData.push(cards[i]);
									} else if (cards[i].status === "In progress") {
										thirdData.push(cards[i]);
									} else if (cards[i].status === "Testing") {
										fourthData.push(cards[i]);
									} else if (cards[i].status === "Finished") {
										fifthData.push(cards[i]);
									}
								}
							}
							projectStatus = {
								notsetcount : firstData.length,
								readyfordevcount : secondData.length,
								inprogresscount : thirdData.length,
								testingcount : fourthData.length,
								finishedcount : fifthData.length
							};
							res.send({
								"success" : "load"
							});
						}
					});
};

/**
 * @author PraveenK
 */
exports.scrumStatus = function(req, res) {

	if (req.session === undefined || req.session.userId === undefined) {
		login.start(req, res);
	} else {
		var userId = req.session.userId;

		var mongo = db.mongo;
		mongo.collection('scrum').find({
			'userId' : userId
		}, {
			projectName : true,
			_id : false
		}).toArray(function(err, result) {
			if (err) {
				res.send({
					'status' : 'Failed',
					'error' : 'User has not created any project yet.'
				});
			}
			console.log(JSON.stringify(result));
			res.send({
				'status' : 'Success',
				'projects' : result
			});
		})

	}

}

exports.getProjects = function(req, res) {
	if (req.session === undefined || req.session.userId === undefined) {
		res.render('homepage');

	} else {
		var userId = req.session.userId;
		var modelType = req.session.modelType;

		var mongo = db.mongo;
		mongo.collection(modelType).find({
			'userId' : userId
		}, {
			projectName : true,
			_id : false
		}).toArray(function(err, result) {
			if (err) {
				res.send({
					'status' : 'Failed',
					'error' : 'User has not created any project yet.'
				});
			}
			console.log(JSON.stringify(result));
			res.send({
				'status' : 'Success',
				'projects' : result
			});
		})
	}

}

exports.temp = function(req, res) {
	res.render('view');
}

exports.loadCards = function(req, res) {
	if (req.session === undefined || req.session.userId === undefined) {
		login.start(req, res);
	} else {
		console.log('first load.....');
		console.log(firstData);
		res.render('index', {
			title : 'Kanban View',
			firstdata : firstData,
			seconddata : secondData,
			thirddata : thirdData,
			forthdata : fourthData,
			fifthdata : fifthData
		});
	}
};

exports.getData = function(req, res) {

	if (req.session === undefined || req.session.userId === undefined) {
		res.render('homepage');

	} else {

		console.log('Getting user data from db');
		var userId = req.session.userId;
		var modelType = req.session.modelType;
		var projectName = req.param('projectName');

		if (projectName !== null || projectName !== undefined) {
			req.session.projectName = projectName;
		}

		if (modelType === undefined) {
			res
					.send({
						"error" : "Something went wrong. User data doesn't contain any tenant type."
					});
		} else if (modelType === "waterfall") {
			var mongo = db.mongo;
			mongo.collection("waterfall").find({
				"userId" : userId,
				'projectName' : projectName
			}).toArray(function(err, result) {
				if (err || !result) {
					res.send({
						"error" : "Something went wrong"
					});
				} else {
					console.log(result);
					if (result.length > 0) {
						console.log('Got data from db.. In waterfalllll');
						console.log(result);
						req.session.data = result[0];
						// res.render('view', {
						// session:session.data
						// });
						res.send({
							'data' : result,
							'modelType' : modelType
						});
						// res.render('view');
					} else {
						res.send({
							"Login" : "Fail",
						});
					}
				}
			});
		} else if (modelType === "kanban") {
			var mongo = db.mongo;
			mongo.collection("kanban").find({
				"userId" : userId,
				'projectName' : projectName
			}).toArray(function(err, result) {
				if (err || !result) {
					res.send({
						"error" : "Something went wrong"
					});
				} else {
					console.log(result);
					// load kanban project view in getCards
					// function
					getCards(result, req, res);
				}
			});
		} else if (modelType === "scrum") {
			var mongo = db.mongo;
			mongo.collection("scrum").find({
				"userId" : userId,
				'projectName' : projectName
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
						// res.send(result);
						res.send({
							'data' : result,
							'modelType' : modelType
						});
					} else {
						res.send({
							"Login" : "Fail",
						});
					}
				}
			});
		} else if (modelType === "scrum") {
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
	}
};

exports.getTasksOnStatus = function(req, res) {
	if (req.session === undefined || req.session.userId === undefined) {
		login.start(req, res);
	} else {
		var mongo = db.mongo;
		var userId = req.session.userId;
		var projectName = req.param("projectName");
		var completed = req.param("completed");

		mongo.collection("waterfall").find({
			"userId" : userId,
			'projectName' : projectName
		}, {
			tasks : {
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
}

/**
 * Update card details for kanban
 * 
 * @param req
 * @param res
 */
exports.updateCard = function(req, res) {
	// if(req.session === undefined || req.session.userId === undefined){
	// login.start(req,res);
	// } else {
	// var userId = req.param("userId");
	// var projectName = req.param("projectName");
	var userId = req.session.userId;
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

			'cards.$.description' : description,
			'cards.$.startDate' : startDate,
			'cards.$.endDate' : endDate,
			'cards.$.teamSize' : teamSize,
			'cards.$.comments' : comments,
			'cards.$.resources' : resources,
			'cards.$.priority' : priority
		}
	}, function(err, result) {

		// console.log(err);
		// console.log(result);
		res.send({
			"result" : result
		});
	});
	// }
};

/**
 * Update card status for kanban
 * 
 * @param req
 * @param res
 */
exports.updateCardStatus = function(req, res) {
	// if(req.session === undefined || req.session.userId === undefined){
	// login.start(req,res);
	// } else {
	// var userId = req.param("userId");
	// var projectName = req.param("projectName");
	var userId = req.session.userId;
	var projectName = "Testing Project";

	var cardId = req.param("cardId");
	var column = req.param("status");

	console.log(column);
	var status = null;
	if (column === "secondcol") {
		status = "Ready for Dev";
		console.log(status);
	} else if (column === "thirdcol") {
		status = "In progress";
	} else if (column === "forthcol") {
		status = "Testing";
	} else if (column === "fifthcol") {
		status = "Finished";
	}
	if (!userId || !projectName || !cardId || userId === undefined
			|| projectName === undefined || cardId === undefined
			|| status === undefined) {
		res.send({
			"error" : "In Sufficient details"
		});
	}

	var mongo = db.mongo;
	console.log(cardId);
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

		if (err) {
			console.log("failed");
			res.send({
				"error" : "failed to move card!"
			});
		} else {
			console.log("success");
			res.send({
				"success" : "success"
			});
		}

	});
	// }
};

/**
 * delete card for kanban
 * 
 * @param req
 * @param res
 */
exports.deleteCard = function(req, res) {
	if (req.session === undefined || req.session.userId === undefined) {
		login.start(req, res);
	} else {
		// var userId = req.param("userId");
		// var projectName = req.param("projectName");
		var userId = req.session.userId;
		var projectName = "Testing Project";

		var cardId = req.param("cardId");

		if (!userId || !projectName || !cardId || userId === undefined
				|| projectName === undefined || cardId === undefined) {
			res.send({
				"error" : "In Sufficient details"
			});
		}

		var mongo = db.mongo;
		console.log(cardId);
		mongo.collection("kanban").update({
			"userId" : userId,
			'projectName' : projectName
		}, {
			$pull : {
				'cards' : {
					cardId : cardId
				}
			}
		}, function(err, result) {

			if (err) {
				console.log("failed");
				res.send({
					"error" : "failed to move card!"
				});
			} else {
				console.log("success");
				res.send({
					"success" : "success"
				});
			}

		});
	}
};

exports.getAllProjects = function(req, res) {

}

/**
 * delete card for kanban
 * 
 * @param req
 * @param res
 */
exports.deleteTask = function(req, res) {
	if (req.session === undefined || req.session.userId === undefined) {
		login.start(req, res);
	} else {
		var userId = req.session.userId;
		var projectName = req.session.projectName;

		var taskId = req.param("taskId");

		if (!userId || !projectName || !taskId || userId === undefined
				|| projectName === undefined || taskId === undefined) {
			res.send({
				"error" : "In Sufficient details"
			});
		}

		var mongo = db.mongo;
		console.log(taskId);
		mongo.collection("waterfall").update({
			"userId" : userId,
			'projectName' : projectName
		}, {
			$pull : {
				'tasks' : {
					taskId : taskId
				}
			}
		}, function(err, result) {

			if (err) {
				console.log("failed");
				res.send({
					"error" : "failed to move task!",
					'status' : 'Failed'
				});
			} else {
				console.log("success");
				res.send({
					"status" : "Success"
				});
			}

		});
	}
};

/**
 * delete card for kanban
 * 
 * @param req
 * @param res
 */
exports.deleteUserstory = function(req, res) {
	var userId = req.session.userId;
	var projectName = req.session.projectName;

	var id = req.param("id");

	if (!userId || !projectName || !id || userId === undefined
			|| projectName === undefined || id === undefined) {
		res.send({
			"error" : "In Sufficient details"
		});
	}

	var mongo = db.mongo;
	console.log(id);
	mongo.collection("scrum").update({
		"userId" : userId,
		'projectName' : projectName
	}, {
		$pull : {
			'userStories' : {
				id : id
			}
		}
	}, function(err, result) {

		if (err) {
			console.log("failed");
			res.send({
				"error" : "failed to move user story!",
				'status' : 'Failed'
			});
		} else {
			console.log("success");
			res.send({
				"status" : "Success"
			});
		}

	});
};

/**
 * Updates task details in waterfall model
 */
exports.updateTask = function(req, res) {
	var userId = req.session.userId;
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
	// console.log('predecessors '+predecessors);
	// if(predecessors !== undefined){
	// predecessors = predecessors.split(',');
	// }
	// if(resources !== undefined){
	// resources = resources.split(',');
	// }
	// console.log(predecessors);

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
	var userId = req.session.userId;
	var projectName = req.param("projectName");
	var taskId = req.param("taskId");
	var completed = req.param("completed");

	if (!userId || !projectName || !taskId || !completed
			|| userId === undefined || projectName === undefined
			|| taskId === undefined || completed === undefined) {
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
	// var userId = req.param("userId");
	// var projectName = req.param("projectName");

	var userId = req.session.userId;
	var projectName = req.session.projectName;
	var task = req.param("task");
	console.log('In add task: ' + JSON.stringify(task));
	console.log('userId: ' + userId);
	console.log('projectName: ' + projectName);
	// var taskId = req.param("taskId");
	// var taskName = req.param("taskName");
	// var duration = req.param("duration");
	// var startDate = req.param("startDate");
	// var endDate = req.param("endDate");
	// var predecessors = req.param("predecessors");
	// var resources = req.param("resources");
	// var risks = req.param("risks");
	// var completed = req.param("completed");

	if (!userId || !projectName || !task.taskId || !task.duration
			|| !task.startDate || !task.endDate || !task.completed
			|| userId === undefined || projectName === undefined
			|| task.taskId === undefined || task.duration === undefined
			|| task.startDate === undefined || task.endDate === undefined
			|| task.completed === undefined) {
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
					'taskId' : task.taskId
				}
			}
		}).toArray(
				function(err, results) {
					if (results.length > 0) {
						console.log('Task with id ' + task.taskId
								+ ' already exists.');
						res.send({
							'error' : 'Task with given id already exists.'
						});
					} else {
						console.log('Creating task with id' + task.taskId);
						mongo.collection("waterfall").update(
								{
									"userId" : userId,
									'projectName' : projectName,
								},
								{
									$push : {
										'tasks' : task
									}
								},
								function(err, result) {
									if (err) {
										res.send({
											'status' : 'Failed',
											error : 'err'
										})
									} else {
										console.log('task with id '
												+ task.taskId
												+ ' created successfully.');
										res.send({
											"result" : result,
											'status' : 'Success'
										});
									}
								});
					}
				});

	}
};

exports.getSprints = function(req, res) {
	var mongo = db.mongo;
	mongo.collection("scrum").find({

	}, {
		'sprints' : 1
	}).toArray(function(err, result) {
		if (err || !result) {
			res.send({
				"error" : "Something went wrong"
			});
		} else {
			console.log(result);
			if (result.length > 0) {
				console.log('Got data from db..');
				console.log(result);
				res.send({
					'sprints' : result[0].sprints,
					'status' : 'Success'
				});
				// res.render('view',{'data':result});s
			} else {
				res.send({
					"error" : "Unable to fetch data",
					'status' : 'Failed'
				});
			}
		}
	});
}

/**
 * Updates task details in waterfall model
 */
exports.updateUserStoryStatus = function(req, res) {
	var userId = req.session.userId;
	var projectName = req.session.projectName;
	var id = req.param("id");
	var status = req.param("status");

	if (!userId || !projectName || !id || !status || userId === undefined
			|| projectName === undefined || id === undefined
			|| status === undefined) {
		res.send({
			"error" : "Insufficient details"
		});
	} else {
		var mongo = db.mongo;
		mongo.collection("scrum").update({
			"userId" : userId,
			'projectName' : projectName,
			userStories : {
				$elemMatch : {
					"id" : id
				}
			}
		}, {
			$set : {
				'userStories.$.status' : status
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
exports.updateUserStorySprint = function(req, res) {
	var userId = req.session.userId;
	var projectName = req.param("projectName");
	var id = req.param("id");
	var sprint = req.param("sprint");

	if (!userId || !projectName || !id || !sprint || userId === undefined
			|| projectName === undefined || id === undefined
			|| sprint === undefined) {
		res.send({
			"error" : "Insufficient details"
		});
	} else {
		var mongo = db.mongo;
		mongo.collection("scrum").update({
			"userId" : userId,
			'projectName' : projectName,
			userStories : {
				$elemMatch : {
					"id" : id
				}
			}
		}, {
			$set : {
				'userStories.$.sprint' : sprint
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
exports.addUserStory = function(req, res) {
	var userId = req.session.userId;
	var newStory = req.param('newStory');

	var projectName = req.param("projectName");
	newStory.projectName = projectName;

	var userId = req.session.userId;
	var newStory = req.param('newStory');

	var projectName = req.param("projectName");
	newStory.projectName = projectName;
	var backlogId = newStory.backlog;
	var userStoryName = newStory.name;
	var userStoryId = newStory.id;
	var acceptanceCriteria = newStory.acceptanceCriteria;
	var days = newStory.days;
	var points = newStory.points;
	var resources = newStory.resources;
	var risks = newStory.risks;
	var status = newStory.status;
	var sprintId = newStory.sprint;
	// var backlogId = req.param("backlogId");
	// var userStoryName = req.param("name");
	// var userStoryId = req.param("userStoryId");
	// var acceptanceCriteria = req.param('acceptanceCriteria');
	// var days = req.param("days");
	// var points = req.param("points");
	// var resources = req.param("resources");
	// var risks = req.param("risks");
	// var status = req.param("status");
	// var sprintId = req.param("sprint");

	// if (!userId || !projectName || !backlogId || !userStoryId || !days
	// 		|| !points || userId === undefined || projectName === undefined
	// 		|| backlogId === undefined || userStoryId === undefined
	// 		|| days === undefined || points === undefined) {
	// 	res.send({
	// 		"error" : "Insufficient details"
	// 	});
	// } else {
console.log('project name '+projectName+userId);
		if (status === undefined) {
			status = 'TO DO';
		}
		var mongo = db.mongo;
		mongo
				.collection('scrum')
				.find({
					'userId' : userId,
					'projectName' : projectName,
					userStories : {
						$elemMatch : {
							'id' : userStoryId,

						}
					}
				})
				.toArray(
						function(err, results) {
							console
									.log('checked whether user story with given id exists are not.'
											+ JSON.stringify(results));
							if (results.length > 0) {
								res
										.send({
											'error' : 'Task with given id already exists.'
										});
							} else {
								mongo
										.collection("scrum")
										.update(
												{
													"userId" : userId,
													'projectName' : projectName,
												},
												{
													$push : {
														'userStories' : {
															'id' : userStoryId,
															'name' : userStoryName,
															'days' : days,
															'points' : points,
															'acceptanceCriteria' : acceptanceCriteria,
															'resources' : resources,
															'risks' : risks,
															'status' : status,
															'sprint' : sprintId,
															'backlog' : backlogId
														}
													}
												}, function(err, result) {
													// console.log(result);
													// console.log(res);
													res.send({
														"result" : result
													});
												});
							}
						});

	// }
};

/**
 * Update card details for kanban
 * 
 * @param req
 * @param res
 */
exports.updateUserStory = function(req, res) {
	// var userId = req.param("userId");
	// var projectName = req.param("projectName");
	var userId = req.session.userId;
	var projectName = req.session.projectName;
	var story = req.param('data');
	console.log(story);
	// var id = req.param("id");
	// var backlogId = req.param("backlogId");
	// var name = req.param("name");
	// var duration = req.param("duration");
	// var days = req.param("days");
	// var points = req.param("points");
	// var resources = req.param("resources");
	// var acceptanceCriteria = req.param("acceptanceCriteria");
	// var priority = req.param("priority");
	// var risks = req.param('risks');
	// var status = req.param('status');
	// var sprint = req.param('sprint');

	// console.log(cardId);
	// console.log(name);
	// console.log(duration);
	// console.log(days);
	// console.log(points);
	// console.log(resources);
	// console.log(acceptanceCriteria);
	// console.log(priority);

	if (!story.id || !projectName || userId === undefined
			|| projectName === undefined) {
		res.send({
			"error" : "In Sufficient details"
		});
	}
	var mongo = db.mongo;
	mongo.collection("scrum").update({
		"userId" : userId,
		'projectName' : projectName,
		userStories : {
			$elemMatch : {
				"id" : story.id
			}
		}
	}, {
		$set : {

			'userStories.$.name' : story.name,
			'userStories.$.comments' : story.comments,
			'userStories.$.days' : story.days,
			// 'userStories.$.risks' : risks,
			'userStories.$.acceptanceCriteria' : story.acceptanceCriteria,
			'userStories.$.points' : story.points,
			'userStories.$.resources' : story.resources,
			'userStories.$.sprint' : story.sprint,
			'userStories.$.status' : story.status
		// 'userStories.$.backlog':backlogId
		}
	}, function(err, result) {

		// console.log(err);
		// console.log(result);
		res.send({
			"result" : result
		});
	});
};

/**
 * Add card to kanban model.
 */
exports.addCard = function(req, res) {
	// var userId = req.param("userId");
	// var projectName = req.param("projectName");

	var userId = req.session.userId;
	var projectName = req.param("projectName");
	if(projectName===undefined){
		projectName = "Testing Project";
	}

	var cardId = req.param("cardId");
	var name = req.param("cardName");
	var description = req.param("carddescription");

	if (!userId || !projectName || !cardId || !description || !name
			|| userId === undefined || projectName === undefined
			|| cardId === undefined || description === undefined) {
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
				console.log("element already found");
				res.send({
					"error" : "Card with given id already exists."
				});
			} else {
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
					if (err) {
						console.log(err);
						res.send({
							"error" : result
						});
					} else {
						console.log("success DB update");
						res.send({
							"success" : result
						});
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
	var userId = req.session.userId;
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
	var userId = req.session.userId;
	var modelType = req.session.modelType;
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
	var userId = req.session.userId;
	var projectName = req.param('projectName');
	var projectDescription = req.param('projectDescription');
	var modelType = req.session.modelType;
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
};

/*
 * Gets all custom fields and fieldTypes
 */
exports.getCustomFields = function(req, res) {
	 var userId = req.session.userId;
	// var userId = req.param('userId');
//	var userId = 'abcd@gm.com';
	var mongo = db.mongo;

	mongo.collection('metadata').find({
		userId : userId
	}).toArray(function(error, result) {
		if (error) {
			res.send({
				'status' : 'Failed'
			});
		} else {
			if (result.length > 0) {
				console.log(JSON.stringify(result));
				res.send({
					'status' : 'Success',
					fields : result[0].fields
				});
			} else {
				res.send({
					'status' : 'Success',
					fields : null
				});
			}
		}
	});
}

/**
 * Creates custom field and feildType.
 */
exports.createCustomField = function(req, res) {
	// var userId = req.session.userId;
	// var userId = req.param('userId');
	var userId = req.session.userId;
	var mongo = db.mongo;

	// var fieldNa = req.param('fieldName');
	// var fieldVa = req.param('fieldType');
	var fieldNa = 'new';
	var fieldVa = 'string';
	console.log('in createCustomField');
	mongo.collection('metadata').find({
		userId : userId
	}, {
		fieldName : true,
		fieldType : true,
		userId : true
	}).toArray(function(error, result) {
		console.log(result);
		if (error) {
			res.send({
				'status' : 'Failed'
			});
		} else if (result.length > 0) {
			console.log('result > 0');
			mongo.collection('metadata').update({
				userId : userId
			}, {
				$push : {
					fields : {
						fieldName : fieldNa,
						fieldType : fieldVa
					}
				}
			}, function(err, resu) {
				if (err) {
					res.send({
						'status' : 'Failed'
					});
				} else {
					res.send({
						'status' : 'Success'
					});
				}
			})
		} else {
			mongo.collection('metadata').insert({
				userId : userId,
				fields : [ {
					fieldName : fieldNa,
					fieldType : fieldVa
				} ]
			}, function(err, resu) {
				if (err) {
					res.send({
						'status' : 'Failed'
					});
				} else {
					res.send({
						'status' : 'Success'
					});
				}
			})
		}
	});
};

exports.create = function(req, res) {
	res.render('create');
};
exports.edit = function(req, res) {
	res.render('edit');
};
exports.view = function(req, res) {
	res.render('view');
};

/**
 * @TODO 3. Project status --> each status type and curresponding no of cards.
 */
