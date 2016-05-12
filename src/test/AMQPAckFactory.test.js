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

var sinon = require('sinon');
var assert = require('chai').assert;
var AMQPAck = require('../lib/implementations/amqp/AMQPAck');
var AMQPAckFactory = require('../lib/implementations/amqp/AMQPAckFactory');

suite('AMQPAckFactory', function(){
	var sut;

	var nodeAck = {};
	var settings = {foo: 'bar'};

	setup(function(){
		sut = new AMQPAckFactory();
	});

	suite('#getAck', function(){
		test('Returns an AMQPAck object with node-ack and settings set', function(){
			var ack = sut.getAck(nodeAck, settings);
			assert.instanceOf(ack, AMQPAck);
		});
	});
});