/**
 * New node file
 */

var mongoURL = "mongodb://username:password@localhost:port/dbname";
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
