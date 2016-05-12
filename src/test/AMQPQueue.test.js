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
var Connection = require('amqp').Connection;
var eyeosBind = require('eyeos-bind');
var settings = require('../lib/settings-test');
var AMQPQueue = require('../lib/implementations/amqp/AMQPQueue');
var AMQPExchange = require('../lib/implementations/amqp/AMQPExchange');
var AMQPBinderManager = require('../lib/implementations/amqp/AMQPBinderManager');
var AMQPExchangeFactory = require('../lib/implementations/amqp/AMQPExchangeFactory');

suite('AMQPQueue', function(){
	var sut;
	var amqpConnection, amqpConnectionMock;
	var eyeosBindMock, AMQPExchangeFactoryMock;
	var expBindCalled, expQueue, expQueueSubcribe, expBinderBindExchangesToQueue;
	var expGetExchange, expBindExchange;

    var binderManager, binderManagerMock;

	var exchange, exchangeMock;
	var returnedFunc = function(){};
	var fakeQueue = {
		subscribe: function(){},
	};
	var fakeQueueMock;

	var callback = function(){};
	var router = {};
	var authFilter = {};

	setup(function(){
		fakeQueueMock = sinon.mock(fakeQueue);
		eyeosBindMock = sinon.mock(eyeosBind);
		amqpConnection = new Connection();
        amqpConnectionMock = sinon.mock(amqpConnection);
        binderManager = new AMQPBinderManager(amqpConnection);
        binderManagerMock = sinon.mock(binderManager);
        expQueue = amqpConnectionMock.expects('queue').once().withExactArgs(settings.type, settings.queue, returnedFunc).returns(fakeQueue);
		expQueueSubcribe = fakeQueueMock.expects('subscribe').once().withExactArgs(settings.subscription, callback);
        expBinderBindExchangesToQueue = binderManagerMock.expects('bindExchangesToQueue').once().withExactArgs(amqpConnection, settings, fakeQueue);

		AMQPExchangeFactoryMock = sinon.mock(AMQPExchangeFactory);
		expGetExchange = AMQPExchangeFactoryMock.expects('getExchange').once().withExactArgs(router, authFilter, amqpConnection, settings).returns(exchange);

		exchange = new AMQPExchange();
		exchangeMock = sinon.mock(exchange);

		expBindExchange = eyeosBindMock.expects('bind').once().withExactArgs(exchange, exchange.messageReceived).returns(callback);

		sut = new AMQPQueue(router, authFilter, amqpConnection, settings, eyeosBind, AMQPExchangeFactory, binderManager);

		expBindCalled = eyeosBindMock.expects('bind').once().withExactArgs(sut, sut.queueOpened).returns(returnedFunc);
	});

	teardown(function() {
		eyeosBindMock.restore();
		fakeQueueMock.restore();
        binderManagerMock.restore();
		AMQPExchangeFactoryMock.restore();
	});

	suite('#open', function(){
		test('Should call this.bind.bind with this and queuedOpened method', function () {
			sut.open();
			expBindCalled.verify();
		});
		test('Should call connection.queue', function(){
			sut.open();
			expQueue.verify();
		});
	});

	suite('#queueOpened', function(){
		setup(function() {
			sut.amqpQueue = fakeQueue;
		});

		test('Should call amqpQueue.subcribe', function(){
			sut.queueOpened(fakeQueue);
			expQueueSubcribe.verify();
		});

		test('Should call exchangeFactory.getExchange', function () {
			sut.queueOpened(fakeQueue);
			expGetExchange.verify();
		});

        test('Should call amqpBinderManager.bindExchangesToQueue', function () {
            sut.queueOpened(fakeQueue);
            expBinderBindExchangesToQueue.verify();
        });

	});
});