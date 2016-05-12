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

var AMQPResponse = function(ack, deliveryInfo, exchange, settings, replyFactory) {
	this.type = 'camel';
	this.ack = ack;
	this.exchange = exchange;
	this.deliveryInfo = deliveryInfo;
	this.settings = settings;
	this.replyFactory = replyFactory || require('./AMQPReplyFactory');
	var maxTimeout = (settings && settings["maxTimeOut"]!==undefined)?settings.maxTimeOut:120000;
	var self = this;
	this._timeout = setTimeout(function() {
		self.fail(408, "Timeout");
	}, maxTimeout);
};

AMQPResponse.prototype.setType = function(type) {
	this.type = type;
};

AMQPResponse.prototype.getAck = function() {
	this._cancelTimeout();
	return this.ack;
};

AMQPResponse.prototype.end = function(doc) {
	this._cancelTimeout();
	this.__getAndSendreply(200, doc);
};

AMQPResponse.prototype.fail = function(errorCode, doc) {
	this._cancelTimeout();
	this.__getAndSendreply(errorCode, doc);
};

AMQPResponse.prototype.reject = function(requeue) {
	this._cancelTimeout();
	var reply = this.replyFactory.getReply(null, null, this.exchange, this.ack, this.deliveryInfo, this.settings);
	reply.reject(requeue);
};

AMQPResponse.prototype._cancelTimeout = function() {
	if(this._timeout) {
		clearTimeout(this._timeout);
	}
};

AMQPResponse.prototype.__getAndSendreply = function(statusCode, doc) {
	if(typeof doc === "string" && typeof doc !== "object" && this.type === 'camel') {
		doc = {
			"directCamelMessage" : doc
		}
	}
	var reply = this.replyFactory.getReply(statusCode, doc, this.exchange, this.ack, this.deliveryInfo, this.settings, this.type);
	reply.send();
};


AMQPResponse.prototype.invalidRequest = function(request) {
	this._cancelTimeout();
	this.fail(403, "InvalidRequest:["+JSON.stringify(request)+"]");
};

module.exports = AMQPResponse;
