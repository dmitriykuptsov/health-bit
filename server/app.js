// Exports
var http     = require('http');
var express  = require('express');
var redis    = require('redis');

var routes   = require('./routes');
var io       = require('socket.io');
var net      = require('net');
var fs       = require('fs');
var ursa     = require('ursa');
var when     = require('when');
var path     = require('path');

var SparkCore = require('./spark-protocol/js/clients/SparkCore.js');
var CryptoLib = require('./spark-protocol/js/lib/ICrypto.js');
var spark     = require("./spark-protocol/js/clients/SparkCore.js");

global.settings = require('./config').config;

// Create redis client
var redis_client  = redis.createClient();

// Configuration
var port    = settings.http_port || 80;

// Application server configuration
var app     = express();

// Core simple in memory database
var _allCoresByID = {};
var _attribsByID  = {};

//
//  Load the provided key, or generate one
//
if (!fs.existsSync(settings.sparkServerKeyFile)) {
	console.warn("Creating NEW server key");
	var keys = ursa.generatePrivateKey();
	var extIdx = settings.sparkServerKeyFile.lastIndexOf(".");
	var derFilename = settings.sparkServerKeyFile.substring(0, extIdx) + ".der";
	var pubPemFilename = settings.sparkServerKeyFile.substring(0, extIdx) + ".pub.pem";

	fs.writeFileSync(settings.sparkServerKeyFile, keys.toPrivatePem('binary'));
	fs.writeFileSync(pubPemFilename, keys.toPublicPem('binary'));

	//DER FORMATTED KEY for the core hardware
	//TODO: fs.writeFileSync(derFilename, keys.toPrivatePem('binary'));
}


//
//  Load our server key
//
console.info("Loading server key from " + settings.sparkServerKeyFile);

CryptoLib.loadServerKeys(
	settings.sparkServerKeyFile
);

//Configure web socket
//var socket  = io.listen(app);

// Configure routes
app.get('/measurement/:id', routes.get_last_measurement);



// Start TCP socket to listen to Spark Core devices
var sparkserver = net.createServer(function (socket) {

	console.log('Received connection from the core....');

	var core = new SparkCore();
	core.socket = socket;
	core.startupProtocol();

	core.on('ready', function () {
		console.log("Core online!");
		var coreid = this.getHexCoreID();
		_allCoresByID[coreid] = core;
		_attribsByID[coreid] = _attribsByID[coreid] || {
			coreID: coreid,
			name: null,
			ip: this.getRemoteIPAddress(),
			product_id: this.spark_product_id,
			firmware_version: this.product_firmware_version
		};
	});

	core.on('disconnect', function (msg) {
		logger.log("Session ended for " + connId);
		delete _cores[key];
	});

});

sparkserver.listen(settings.spark_port, function () {
    console.log("server started", { host: settings.host, port: settings.spark_port });
});
