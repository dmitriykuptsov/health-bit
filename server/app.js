// Exports
var http    = require('http');
var express = require('express');
var redis   = require('redis');
var config  = require('./config');
var routes  = require('./routes');
var io      = require('socket.io');
var net     = require('net');

var spark   = require("./spark-protocol/js/clients/SparkCore.js");

// Create redis client
var redis_client  = redis.createClient();

// Configuration
var port    = config.http_port || 80;

// Application server configuration
var app     = express();

//Configure web socket
//var socket  = io.listen(app);

// Configure routes
app.get('/measurement/:id', routes.get_last_measurement);

// Start TCP socket to listen to Spark Core devices
var tcpserver = net.createServer(function (socket) {

	var core = new SparkCore();
	core.socket = socket;
	core.startupProtocol();

	core.on('ready', function () {
		logger.log("Core online!");
		var coreid = this.getHexCoreID();
		that._allCoresByID[coreid] = core;
		that._attribsByID[coreid] = that._attribsByID[coreid] || {
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