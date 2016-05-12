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
var log2out = require('log2out');
var AMQPReplyConfirmation = require('../lib/implementations/amqp/AMQPReplyConfirmation');

suite('AMQPReplyConfirmation', function(){
	var sut;

	var logger, loggerMock;
	var expAcknowledge, expWarn;
	var amqpAckMock;
	var fakeAMQPAck = {
		acknowledge : function(){}
	};

	var error = new Error('Some exception for testing');

	setup(function(){
		logger = log2out.getLogger('AMQPReplyConfirmation-test');
		loggerMock = sinon.mock(logger);
		amqpAckMock = sinon.mock(fakeAMQPAck);
		expWarn = loggerMock.expects('warn').once().withExactArgs(error);
		sut = new AMQPReplyConfirmation(fakeAMQPAck, logger);
	});

	teardown(function(){
		amqpAckMock.restore();
		loggerMock.restore();
	});

	suite('#publishFinished', function(){
		test.skip('If passed argument is true, this.ack.acknowledge() should never be called', function(){
			expAcknowledge = amqpAckMock.expects('acknowledge').never();
			sut.publishFinished(true, error);
			expAcknowledge.verify();
		});
		test('If passed argument is true, the error should be logged', function () {
			sut.publishFinished(true, error);
			expWarn.verify();
		});
		test('If passed argument is false, this.ack.acknowledge should be called', function () {
			expAcknowledge = amqpAckMock.expects('acknowledge').once();
			sut.publishFinished(false);
			expAcknowledge.verify();
		});
	});
});
