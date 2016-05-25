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
var bind = require('eyeos-bind');
var amqp = require('amqp');
var settings = require('../lib/settings-test');
var AMQPServer = require('../lib/implementations/amqp/AMQPServer');
var AMQPConnectionMonitor = require('../lib/implementations/amqp/AMQPConnectionMonitor');
var AMQPQueueFactory = require('../lib/implementations/amqp/AMQPQueueFactory');
var AMQPQueue = require('../lib/implementations/amqp/AMQPQueue');

suite('AMQPConnectionMonitor', function(){
	var sut;

	var amqpServer, amqpServerMock;
	var amqpConnetion, amqpConnetionMock;
	var amqpQueue, amqpQueueMock;
	var amqpQueueFactoryMock, bindMock;
	var expGetRequest, expGetQueue, expOn, expRemoveListeners;
	var expServerNext, expRemoveListenersClose, expOnClose;

	var router = {};
	var authFilter = {};
	var fakeServer = {};
	var fakeConn = {on: function(){}};
	var readyCallback = function(){};
	var closeCallback = function(){};

	setup(function(){

		amqpServer = new AMQPServer();
		amqpServerMock = sinon.mock(amqpServer);
		expServerNext = amqpServerMock.expects('connectToNextHost').once();

		amqpConnetion = new amqp.Connection();
		amqpConnetionMock = sinon.mock(amqpConnetion);

		expOn = amqpConnetionMock.expects('on').thrice();
		expRemoveListeners = amqpConnetionMock.expects('removeListener').once().withExactArgs('ready', readyCallback);
		expRemoveListenersClose = amqpConnetionMock.expects('removeListener').once().withExactArgs('close', closeCallback);

		amqpQueue = new AMQPQueue();
		amqpQueueMock = sinon.mock(amqpQueue);

		amqpQueueFactoryMock = sinon.mock(AMQPQueueFactory);
		expGetQueue = amqpQueueFactoryMock.expects('getAMQPQueue').once().withExactArgs(router, authFilter, fakeConn, settings).returns(amqpQueue);

		expGetRequest = amqpQueueMock.expects('open').once().withExactArgs();


		sut = new AMQPConnectionMonitor(router, authFilter, settings, amqpServer, AMQPQueueFactory, readyCallback, closeCallback);
	});

	teardown(function() {
		amqpQueueFactoryMock.restore();
	});

	suite('#connectionReady', function(){
		setup(function() {
			sut.conn = fakeConn;
		});

		test('Should call AMQPQueueFactory.getAMQPQueue', function () {
			sut.connectionReady();
			expGetQueue.verify();
		});

		test('Should call AMQPRequest.open', function(){
			sut.connectionReady();
			expGetRequest.verify();
		});
	});

	suite('#setConnection', function(){
		test('Should call on to establish readyCallback', function(){
			sut.conn = false;
			sut.setConnection(amqpConnetion);
			expOn.verify();
		});
		test('Should set sut.conn equal to whatever we pass on the argument', function () {
			var newFakeConn = {on: function(){}};
			sut.setConnection(newFakeConn);
			assert.equal(newFakeConn, sut.conn);
		});
		test('If a connection is already set, removeListener should be call on that connection', function () {
			sut.conn = amqpConnetion;
			sut.setConnection(fakeConn);
			expRemoveListeners.verify();
		});
	});
});
