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

var AMQPMessageDecoder = require('./AMQPMessageDecoder');
var AMQPRawMessageDecoder = require('./AMQPRawMessageDecoder');
var log2out = require('log2out');
var AMQPAckFactory = require('./AMQPAckFactory');
var eyeosAMQP = require('eyeos-amqp');

var AMQPExchange = function(router, authFilter, conn, settings, ampqMessageDecoder, amqpResponseFactory, amqpAckFactory, amqpRawMessageDecoder) {
	this.router = router;
	this.authFilter = authFilter;
	this.conn = conn;
	this.settings = settings;
	this.ampqMessageDecoder = ampqMessageDecoder || new AMQPMessageDecoder();
	this.amqpResponseFactory = amqpResponseFactory || require('./AMQPResponseFactory');
	this.amqpAckFactory = amqpAckFactory || new AMQPAckFactory();
	this.logger = log2out.getLogger('AMQPExchange');
	this.amqpRawMessageDecoder = amqpRawMessageDecoder || new AMQPRawMessageDecoder();
};

AMQPExchange.prototype.getConnection = function() {
	return this.conn;
};

AMQPExchange.prototype.messageReceived = function(msg, headers, deliveryInfo,  ack) {
	var analyzedRequest;
	var type = headers.messageType;
	if(type === "raw") {
		analyzedRequest = this.amqpRawMessageDecoder.decode(msg);
	} else {
		analyzedRequest = this.ampqMessageDecoder.decode(msg);
	}

	var amqpAck = this.amqpAckFactory.getAck(ack, this.settings);
	var amqpResponse = this.amqpResponseFactory.getResponse(amqpAck, deliveryInfo, eyeosAMQP.getExchange(this.conn, undefined, {
		confirm : false
	}), this.settings, type);
	this.logger.debug('.messageReceived: ', analyzedRequest);

	var isFiltered = this.authFilter.filter(analyzedRequest, amqpResponse);

	if (isFiltered) {
		return;
	}

	try {
		this.router.dispatch(analyzedRequest, amqpResponse);
	} catch (err) {
		this.logger.warn("Uncaught exception in router.dispatch, FIX YOUR DAMN CODE");
		this.logger.warn(err);
		throw err;
	}
};

module.exports = AMQPExchange;