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
var settings = require('../lib/settings-test');
var AMQPExchange = require('../lib/implementations/amqp/AMQPExchange');
var AMQPMessageDecoder = require('../lib/implementations/amqp/AMQPMessageDecoder');
var AMQPRawMessageDecoder = require('../lib/implementations/amqp/AMQPRawMessageDecoder');
var AMQPResponseFactory = require('../lib/implementations/amqp/AMQPResponseFactory');
var AMQPAckFactory = require('../lib/implementations/amqp/AMQPAckFactory');
var AuthFilterByCard = require('../lib/AuthFilterByCard');

suite('AMQPExchange', function(){
	var sut;

	var responseFactory, responseFactoryMock;
	var ampqMessageDecoder, amqpMessageDecoderMock;
	var amqpAckFactory, amqpAckFactoryMock;
	var expDecode, expGetResponse, expRouterDispatch;
	var expRouterNeverCalled, expGetAck;
	var expRawDecode, amqpRawMessageDecoder,amqpRawMessageDecoderMock;

	var msg = {};
	var exchange = {};
	var conn = {
		implOptions: {defaultExchangeName: ''},
		exchange: function(){return exchange}
	};
	var router = {dispatch: function(){}};
	var routerMock;

	var authFilterByCard, authFilterByCardMock;
	var expFilterCall;

	var ack = {};
	var headers = {};
	var rawHeaders = {messageType: "raw"};
	var deliveryInfo = {};
	var analyzedRequest = {};
	var amqpResponse = {};
	var amqpAck = {};

	setup(function(){
		amqpAckFactory = new AMQPAckFactory();
		amqpAckFactoryMock = sinon.mock(amqpAckFactory);
		expGetAck = amqpAckFactoryMock.expects('getAck').once().withExactArgs(ack, settings).returns(amqpAck);

		authFilterByCard = new AuthFilterByCard();
		authFilterByCardMock = sinon.mock(authFilterByCard);
		expFilterCall = authFilterByCardMock.expects('filter').once().withExactArgs(analyzedRequest, amqpResponse).returns(false);

		ampqMessageDecoder = new AMQPMessageDecoder();
		amqpMessageDecoderMock = sinon.mock(ampqMessageDecoder);
		expDecode = amqpMessageDecoderMock.expects('decode').once().withExactArgs(msg).returns(analyzedRequest);

		amqpRawMessageDecoder = new AMQPRawMessageDecoder();
		amqpRawMessageDecoderMock = sinon.mock(amqpRawMessageDecoder);
		expRawDecode = amqpRawMessageDecoderMock.expects('decode').once().withExactArgs(msg).returns(analyzedRequest);

		responseFactory = AMQPResponseFactory;
		responseFactoryMock = sinon.mock(AMQPResponseFactory);
		expGetResponse = responseFactoryMock.expects('getResponse').once().withArgs(amqpAck, deliveryInfo, exchange, settings).returns(amqpResponse);

		routerMock = sinon.mock(router);
		expRouterDispatch = routerMock.expects('dispatch').once().withExactArgs(analyzedRequest, amqpResponse);
		expRouterNeverCalled = routerMock.expects('dispatch').never();
		sut = new AMQPExchange(router, authFilterByCard, conn, settings, ampqMessageDecoder, responseFactory, amqpAckFactory, amqpRawMessageDecoder);
	});

	teardown(function() {
		routerMock.restore();
		responseFactoryMock.restore();
	});

	suite('#messageReceived', function(){
		test('Should call this.ampqRawMessageDecoder.decode with msg as argument', function () {
			sut.messageReceived(msg, rawHeaders, deliveryInfo, ack);
			expRawDecode.verify();
		});

		test('Should call this.ampqMessageDecoder.decode with msg as argument', function () {
			sut.messageReceived(msg, headers, deliveryInfo, ack);
			expDecode.verify();
		});

		test('Should call this.amqpAckFactory.getAck with correct args', function () {
			sut.messageReceived(msg, headers, deliveryInfo, ack);
			expGetAck.verify();
		});

		test('Should call this.amqpResponseFactory.getResponse', function () {
			sut.messageReceived(msg, headers, deliveryInfo, ack);
			expGetResponse.verify();
		});

		test('Should call this.authFilter.filter with request and response', function () {
			sut.messageReceived(msg, headers, deliveryInfo, ack);
			expFilterCall.verify();
		});

		test('Should call this.router.dispatch with created analyzed and resposne', function () {
			sut.messageReceived(msg, headers, deliveryInfo, ack);
			expRouterDispatch.verify();
		});

		test('If the request is filtered out, router.dispatch should NOT be called', function () {
			expFilterCall.returns(true);
			sut.messageReceived(msg, headers, deliveryInfo, ack);
			expRouterNeverCalled.verify();
		});
	});
});