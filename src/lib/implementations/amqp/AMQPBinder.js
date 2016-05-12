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

"use strict";
/***
 * AMQBinder binds a Queue and an Exchange
 */

var log2out = require('log2out');

var AMQPBinder = function() {
    this.logger = log2out.getLogger('AMQPBinder');
};

AMQPBinder.prototype.bindExchangeToQueue = function(amqpConnection, exchangeSettings, amqpQueue) {
    var exchangeName = exchangeSettings && exchangeSettings.exchangeName;
    var options = exchangeSettings.options;
    var routingKey = exchangeSettings.routingKey || "";

    if (! amqpConnection || ! exchangeSettings || ! exchangeName) {
        this.logger.warn("Skipping exchange to queue binding due to missing parameters: Connection is empty: [",
                          ! amqpConnection, "] exchange settings: [", exchangeSettings, "] exchangeName: [", exchangeName, "]" );
        return;
    }

    this.logger.debug("Binding: exchange:[", exchangeName, "] => queue:[", amqpQueue.name, "] by RoutingKey:[",
                        routingKey, "] with options:[", options, "]");
    amqpConnection.exchange(exchangeName, options, function(){
        amqpQueue.bind(exchangeName, routingKey);
    });
};

module.exports = AMQPBinder;