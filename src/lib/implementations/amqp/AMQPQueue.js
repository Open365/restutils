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

var AMQPBinderManager = require('./AMQPBinderManager');
var log2out = require('log2out');

var AMQPQueue = function(router, authFilter, amqpConnection, settings, bind, exchangeFactory, amqpBinderManager) {
	this.router = router;
	this.authFilter = authFilter;
	this.amqpConnection = amqpConnection;
	this.settings = settings;
	this.bind = bind || require('eyeos-bind');
	this.exchangeFactory = exchangeFactory || require('./AMQPExchangeFactory');
    this.amqpBinderManager = amqpBinderManager || new AMQPBinderManager();
	this.logger = require('log2out').getLogger('AMQPQueue');
};

AMQPQueue.prototype.getSettings = function() {
	return this.settings;
};

AMQPQueue.prototype.open = function() {
	var callback = this.bind.bind(this, this.queueOpened);

	this.logger.debug('.open: waiting for queue',this.settings.queue.name,'to be open');
	this.amqpQueue = this.amqpConnection.queue(this.settings.queue.name, this.settings.queue, callback);
};

AMQPQueue.prototype.queueOpened = function(amqpQueue) {
	this.logger.info('Queue opened:', this.settings.queue.name);
    this.amqpBinderManager.bindExchangesToQueue(this.amqpConnection, this.settings, amqpQueue);
	var exchange = this.exchangeFactory.getExchange(this.router, this.authFilter, this.amqpConnection, this.settings);
	var callback = this.bind.bind(exchange, exchange.messageReceived);

	this.amqpQueue.subscribe(this.settings.subscription, callback);
};

module.exports = AMQPQueue;
