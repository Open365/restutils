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
var Server = require('../lib/Server');
var settings = require('../lib/settings-test');
var DummyImpl = require('../lib/implementations/dummy').Server;
var implementationFactory = require('../lib/implementations/implementationFactory');

suite('Server', function(){
	var sut;
	var dummyImpl, dummyImplMock;
	var implementationFactoryMock;
	var expGetImplementation, expDummyStart;

	var router = {};
	var authFilter = {};

	setup(function(){
		dummyImpl = new DummyImpl({});
		dummyImplMock = sinon.mock(dummyImpl);
		expDummyStart = dummyImplMock.expects('start').once().withExactArgs();

		implementationFactoryMock = sinon.mock(implementationFactory);
		expGetImplementation = implementationFactoryMock.expects('getImplementation').once().withExactArgs(router, authFilter, settings.server).returns(dummyImpl);
		sut = new Server(router, settings.server, authFilter, implementationFactory);
	});

	teardown(function() {
		implementationFactoryMock.restore();
	});

	suite('#start', function(){
		test('Should call implementationFactory.getImplementation with type from settings', function(){
			sut.start();
			expGetImplementation.verify();
		});
		test('Should call start method of the implementation returned by getImplementation', function () {
			sut.start();
			expDummyStart.verify();
		});
	});
});