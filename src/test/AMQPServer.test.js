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
var amqp = require('amqp');
var settings = require('../lib/settings-test');
var AMQPServer = require('../lib/implementations/amqp/AMQPServer');
var HostProvider = require('eyeos-service-bus').HostProvider;
var parseHostsList = require('eyeos-service-bus').parseHostsList;

var AMQPConnectionMonitor = require('../lib/implementations/amqp/AMQPConnectionMonitor');

suite('AMQPServer', function(){
	var sut;
	var hostProvider, hostProviderMock;
	var amqpConnectionMonitor, amqpConnectionMonitorMock;
	var amqpMock;
	var amqpConnetion, amqpConnetionMock;
	var expAMQPCreateConnection, expSetHosts;
	var expGetHost, expSetConnection;

	var router = {};
	var authFilter = {};
	var fakeConnection;
	var hosts = parseHostsList(settings.hosts);

	setup(function(){
		hostProvider = new HostProvider();
		hostProviderMock = sinon.mock(hostProvider);
		expSetHosts = hostProviderMock.expects('setHosts').once().withExactArgs(hosts);
		expGetHost = hostProviderMock.expects('getHost').once().returns(hosts[0]);

		amqpConnectionMonitor = new AMQPConnectionMonitor();
		amqpConnectionMonitor.on = sinon.stub();
		fakeConnection = {
			on: sinon.stub()
		};
		amqpMock = sinon.mock(amqp);

		sut = new AMQPServer(router, authFilter, settings, amqp, amqpConnectionMonitor, hostProvider);
	});

	teardown(function() {
		amqpMock.restore();
	});

	suite('#start', function(){
		test('Should call HostProvider.setHosts with an array of hosts', function () {
			sut.start();
			expSetHosts.verify();
		});
	});

	suite('#connectToNextHost', function(){
		test('Should call HostProvider.getHost', function(){
			sut.connectToNextHost();
			expGetHost.verify();
		});
		test('Should set settings.host from object returned by HostProvider.getHost', function () {
			sut.connectToNextHost();
			assert.equal(hosts[0].host, sut.settings.host);
		});
		test('Should call amqp.createConnection with info from settings', function(){
			expAMQPCreateConnection = amqpMock.expects('createConnection').once().withExactArgs(settings).returns(fakeConnection);

			sut.connectToNextHost();
			expAMQPCreateConnection.verify();
		});
		test('Should call amqpConnectionMonitor.setConnection with the created connection', function () {
			amqpConnectionMonitorMock = sinon.mock(amqpConnectionMonitor);
			expAMQPCreateConnection = amqpMock.expects('createConnection').returns(fakeConnection);
			expSetConnection = amqpConnectionMonitorMock.expects('setConnection').once().withExactArgs(fakeConnection);

			sut.connectToNextHost();
			expSetConnection.verify();
		});
	});
});
