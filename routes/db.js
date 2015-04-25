/**
 * New node file
 */

var mongoURL = "mongodb://test:test@ds061611.mongolab.com:61611/cmpe281";
// //var collections = [ "users" ];
// //var mysql = require('mysql');
// var mongo = require('mongodb');
// var MongoClient = mongo.MongoClient
//
// exports.mongoClient = MongoClient;

var MongoClient = require('mongodb').MongoClient, format = require('util').format;

MongoClient.connect(mongoURL, function(err, mongo) {
	if (err) {
		throw err;
	}
	exports.mongo = mongo;
});
