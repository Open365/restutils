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
var AMQPReplyFactory = require('../lib/implementations/amqp/AMQPReplyFactory');
var AMQPResponse = require('../lib/implementations/amqp/AMQPResponse');
var AMQPReply = require('../lib/implementations/amqp/AMQPReply');

suite('AMQPResponse', function(){
	var sut;

	var amqpReply, amqpReplyMock;
	var replyFactory, replyFactoryMock;
	var expGetReply, expReplySend;

	var ack = {};
	var deliveryInfo = {};
	var exchange = {};

	var document = {foo: "bar"};
	setup(function(){
		amqpReply = new AMQPReply(200, document, ack, deliveryInfo, exchange, replyFactory);
		amqpReplyMock = sinon.mock(amqpReply);
		expReplySend = amqpReplyMock.expects('send').once().withExactArgs();

		replyFactory = AMQPReplyFactory;
		replyFactoryMock = sinon.mock(replyFactory);
		expGetReply = replyFactoryMock.expects('getReply').once().withArgs(200, document).returns(amqpReply);

		sut = new AMQPResponse(ack, deliveryInfo, exchange, replyFactory);
	});

	teardown(function() {
		replyFactoryMock.restore();
	});

	suite('#end', function(){
		test('Should call AMQPReplyFactory.getReply', function () {
			sut.end(document);
			expGetReply.verify();
		});
		test('Should call reply.send of the reply created via Factory', function () {
			sut.end(document);
			expReplySend.verify();
		});
	});

	suite('#fail', function() {
		test('Should call AMQPReplyFactory.getReply', function () {
			expGetReply = replyFactoryMock.expects('getReply').once().withArgs(500, document).returns(amqpReply);
			sut.fail(500, document);
			expGetReply.verify();
		});
		test('Should call reply.send of the reply created via Factory', function () {
			expGetReply = replyFactoryMock.expects('getReply').once().withArgs(500, document).returns(amqpReply);
			sut.fail(500, document);
			expReplySend.verify();
		});
		test('When called with string message should call AMQPReplyFactory.getReply', function() {
			stringMessage = "an error happens";
			expectedMessage = {
				"directCamelMessage" : stringMessage
			};
			expGetReply = replyFactoryMock.expects('getReply').once().withArgs(500, expectedMessage).returns(amqpReply);
			sut.fail(500, stringMessage);
			expReplySend.verify();
		})
	});

	suite("#reject", function () {
		function exercise(requeue) {
			return sut.reject(requeue);
		}

		test("when called should call replyFactory.getReply with correct args", sinon.test(function () {
			expGetReply = replyFactoryMock.expects('getReply')
				.once()
				.withArgs(null, null)
				.returns(amqpReply);
			exercise();
			expGetReply.verify();
		}));

		test("when called with requeue param should call reply.reject with passed param", sinon.test(function () {
			replyFactoryMock.restore();
			this.stub(replyFactory, "getReply").returns(amqpReply);
			var expectation = amqpReplyMock.expects('reject').once().withExactArgs(true);
			exercise(true);
			expectation.verify();
		}));
	});
});
