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

/**
 * This class encapsulates node-amqp ack plus user-provider settings
 * and will use those to decide wether the acknowledge should be
 * called or not (which depends if subscription->ack is true
 */
var AMQPAck = function(ack, settings) {
	this.ack = ack;
	this.settings = settings;
};

AMQPAck.prototype.acknowledge = function() {
	if (!this.settings.subscription || !this.settings.subscription.ack) {
		return;
	}

	this.ack.acknowledge();
};

AMQPAck.prototype.reject = function(requeue) {
	this.ack.reject(requeue);	// true for requeueing the message
};

module.exports = AMQPAck;
