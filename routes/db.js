/**
 * New node file
 */

var mongoURL = "mongodb://test:test@ds061611.mongolab.com:61611/cmpe281";
//var collections = [ "users" ];
var mysql = require('mysql');
var mongodb = require("mongojs")

exports.mongo = function(collection) {
	return mongodb.connect(mongoURL, collection);
//	return mongodb;
}

exports.sql = function() {
	var dbCon = mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : '',
		database : 'test'
	});
	dbCon.connect();
	return dbCon;
}
