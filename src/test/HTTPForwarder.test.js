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
var HTTPForwarder = require('../lib/routers/HTTPForwarder');
var HTTPRequestMarshaller = require('../lib/routers/HTTPRequestMarshaller');
var HTTPRequestMonitor = require('../lib/routers/HTTPRequestMonitor');
var HTTPRequestMonitorFactory = require('../lib/routers/HTTPRequestMonitorFactory');

suite('HTTPForwarder', function(){
	var sut;

	var httpRequestMonitorFactory, httpRequestMonitorFactoryMock;
	var expGetRequestMonitor;

	var httpRequestMonitor, httpRequestMonitorMock;
	var expMonitorStart;

	var httpRequestFactory, httpRequestFactoryMock;
	var expGetRequest;

	var restUtilsRequest = {}, restUtilsReply = {};
	var httpRequest = {};

	var settings = {};
	setup(function(){
		httpRequestMonitor = new HTTPRequestMonitor();
		httpRequestMonitorMock = sinon.mock(httpRequestMonitor);
		expMonitorStart = httpRequestMonitorMock.expects('start')
											.once()
											.withExactArgs();

		httpRequestMonitorFactory = new HTTPRequestMonitorFactory();
		httpRequestMonitorFactoryMock = sinon.mock(httpRequestMonitorFactory);
		expGetRequestMonitor = httpRequestMonitorFactoryMock.expects('getRequestMonitor')
															.withExactArgs(httpRequest, restUtilsReply)
															.returns(httpRequestMonitor);

		httpRequestFactory = new HTTPRequestMarshaller();
		httpRequestFactoryMock = sinon.mock(httpRequestFactory);
		expGetRequest = httpRequestFactoryMock.expects('getRequest')
												.once()
												.withExactArgs(restUtilsRequest)
												.returns(httpRequest);

		sut = new HTTPForwarder(settings, httpRequestFactory, httpRequestMonitorFactory);
	});

	suite('#forward', function(){
		test('Should call get an HTTPRequest by calling the HTTPRequestMarshaller', function(){
			sut.forward(restUtilsRequest, restUtilsReply);
			expGetRequest.verify();
		});
		test('Should get a RequestMonitor by calling the HTTPRequestMonitorFactory', function () {
			sut.forward(restUtilsRequest, restUtilsReply);
			expGetRequestMonitor.verify();
		});
		test('Should call httpMonitor.monitor with the httpRequest and the restUtilsReply', function () {
			sut.forward(restUtilsRequest,restUtilsRequest);
			expMonitorStart.verify();
		});
	});
});