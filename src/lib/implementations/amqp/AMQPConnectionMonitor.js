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
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var AMQPConnectionMonitor = function (router, authFilter, settings, AMQPServer, amqpQueueFactory, readyCallback, closeCallback, bind, injectedSetInterval) {
    this.router = router;
    this.authFilter = authFilter;
    this.settings = settings;
    this.amqpServer = AMQPServer;
    this.amqpQueueFactory = amqpQueueFactory || require('./AMQPQueueFactory');
    this.bind = bind || require('eyeos-bind');
    this.logger = log2out.getLogger('AMQPConnectionMonitor');
    this.setInterval = injectedSetInterval || setInterval;
    this.conn = false;
    this.readyCallback = readyCallback || this.bind.bind(this, this.connectionReady);
};

util.inherits(AMQPConnectionMonitor, EventEmitter);

AMQPConnectionMonitor.prototype.setConnection = function (conn) {
    if (this.conn) {
        this.conn.removeListener('ready', this.readyCallback);
    }

    this.conn = conn;
    this.conn.on('ready', this.readyCallback);

    var self = this;
    this.conn.on('close', function() {
        self.emit('close');
    });

    this.conn.on('error', function (err) {
       self.logger.error(err);
    });
};

AMQPConnectionMonitor.prototype.connectionReady = function () {
    this.logger.debug('.connectionReady');
    var queue = this.amqpQueueFactory.getAMQPQueue(this.router, this.authFilter, this.conn, this.settings);
    queue.open();
};

module.exports = AMQPConnectionMonitor;
