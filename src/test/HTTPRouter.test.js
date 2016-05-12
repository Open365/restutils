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
var HTTPRouter = require('../lib/routers/HTTPRouter');
var HTTPForwarder = require('../lib/routers/HTTPForwarder');

suite('HTTPRouter', function(){
	var sut;

	var httpForwarder, httpForwarderMock;
	var expForward;

	var restUtilsRequest = {},
		restUtilReply = {};

	var settings = {};
	setup(function(){
		var httpForwarder = new HTTPForwarder();
		var httpForwarderMock = sinon.mock(httpForwarder);
		expForward = httpForwarderMock.expects('forward')
										.once()
										.withExactArgs(restUtilsRequest, restUtilReply);

		sut = new HTTPRouter(settings, httpForwarder);
	});

	suite('#dispatch', function(){
		test('Should forward the request to httpForwarder', function(){
			sut.dispatch(restUtilsRequest, restUtilReply);
			expForward.verify();
		});
	});
});