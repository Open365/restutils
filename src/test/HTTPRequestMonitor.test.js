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
var HTTPRequestMonitor = require('../lib/routers/HTTPRequestMonitor');
var HTTPRequestFinisher = require('../lib/routers/HTTPRequestFinisher');
var HTTPRequestFinisherFactory = require('../lib/routers/HTTPRequestFinisherFactory');

suite('HTTPRequestMonitor', function(){
	var sut;

	var httpRequestFinisher, httpRequestFinisherStub;
	var httpResponseFinisherFactory, httpResponseFinisherFactoryMock;
	var expGetResponseFinisher;

	var httpRequest = {
		send: function(callback) {
			callback();
		}
	};
	restUtilsReply = {};

	var spyRequestFinished;
	setup(function(){
		spyRequestFinished = sinon.spy();

		httpRequestFinisher = new HTTPRequestFinisher();
		httpRequestFinisherStub = sinon.stub(httpRequestFinisher, 'requestFinished', spyRequestFinished);

		httpResponseFinisherFactory = new HTTPRequestFinisherFactory();
		httpResponseFinisherFactoryMock = sinon.mock(httpResponseFinisherFactory);
		expGetResponseFinisher = httpResponseFinisherFactoryMock.expects('getRequestFinisher')
																.withExactArgs(httpRequest, restUtilsReply)
																.returns(httpRequestFinisher);

		sut = new HTTPRequestMonitor(httpRequest, restUtilsReply, httpResponseFinisherFactory);
	});

	suite('#start', function(){
		test('Should call HTTPRequestFinisherFactory to get one', function(){
			sut.start();
			expGetResponseFinisher.verify();
		});
		test('Should call httpRequest.send passing as callback a method from requestFinisherher', function () {
			sut.start();
			assert.ok(spyRequestFinished.calledOnce);
			assert.ok(spyRequestFinished.calledOn(httpRequestFinisher));
		});
	});
});