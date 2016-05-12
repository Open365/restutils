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
var CamelToHTTPResponse = require('./camelToHTTPResponse');

var AMQPReply = function(status, doc, exchange, ack, deliveryInfo, settings, type) {
	this.type = type || 'camel';
	this.ack = ack;
	this.exchange = exchange;
	this.deliveryInfo = deliveryInfo;
	this.response = {document: doc, status: status};
	this.opts = {confirm: true};
	if (this.deliveryInfo.correlationId) {
		this.opts.correlationId = this.deliveryInfo.correlationId
	}
	this.settings = settings;
	this.logger = log2out.getLogger('AMQPReply');
};

AMQPReply.prototype.getResponse = function() {
	return this.response;
};

AMQPReply.prototype.send = function() {
	this.logger.debug('.send: ', this.response);

	if (this.settings.subscription && this.settings.subscription.ack) {
		this.ack.acknowledge();
	}

    // Some messages are in the fire and forget format so there is no reply to.
    if (!this.deliveryInfo.replyTo) {
        return;
    }

	if(this.type === 'raw') {
		var camelToHTTPResponse = new CamelToHTTPResponse(this.response);
		this.response = camelToHTTPResponse.getHTTPResponse();
	}

	this.exchange.publish(this.deliveryInfo.replyTo, this.response, this.opts);
};

AMQPReply.prototype.reject = function(requeue) {
	if (this.settings.subscription && this.settings.subscription.ack) {
		this.ack.reject(requeue);
	}
};

module.exports = AMQPReply;
