/*
    Copyright (c) 2016 eyeOS

    This file is part of Open365.

    Open365 is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

var log2out = require('log2out');
var parseHostsList = require('eyeos-service-bus').parseHostsList;
var HostProvider = require('eyeos-service-bus').HostProvider;
var AMQPQueue = require('./AMQPQueue');
var AMQPConnectionMonitor = require('./AMQPConnectionMonitor');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var AMQPServer = function(router, authFilter, settings, amqp, amqpConnectionMonitor, hostProvider) {
	this.router = router;
	this.authFilter = authFilter;
	this.settings = settings;
	this.amqp = amqp || require('amqp');
	this.AMQPConnectionMonitor = amqpConnectionMonitor || new AMQPConnectionMonitor(router, this.authFilter, settings, this);
	this.logger = log2out.getLogger('AMQPServer');
	this.hostProvider = hostProvider || new HostProvider();
};

util.inherits(AMQPServer, EventEmitter);

AMQPServer.prototype.start = function() {
	this.logger.info("'Connecting to queue", this.settings.queue.name);
	this.logger.debug('.start:', util.inspect(this.settings, {depth: 5}));
	var hosts = parseHostsList(this.settings.hosts);
	this.hostProvider.setHosts(hosts);

	this.connectToNextHost();
};

AMQPServer.prototype.connectToNextHost = function() {
	var nextHost = this.hostProvider.getHost();
	this.settings.host = nextHost.host;
	this.settings.port = nextHost.port;

	if (!this.settings.heartbeat) {
		this.settings.heartbeat = parseInt(process.env.EYEOS_RESTUTILS_DEFAULT_HEARTBEAT) || 5;
	}

	this.conn = this.amqp.createConnection(this.settings);
	this.logger.debug('.connectToNextHost: Waiting for connection to be ready to:', nextHost);
	this.AMQPConnectionMonitor.setConnection(this.conn);

	var self = this;
	this.AMQPConnectionMonitor.on("close", function () {
		self.emit('error', new Error("AMQP Connection Lost"));
	});
};

module.exports = AMQPServer;
