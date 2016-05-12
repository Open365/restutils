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
var EyeosAuth = require('eyeos-auth');
var AuthFilterByCard = require('../lib/AuthFilterByCard');

suite('AuthFilterByCard', function(){
	var sut;

	var eyeosAuth, eyeosAuthMock;
	var expVerifyRequest;

	var request = {};
	var response = {fail: function(errorCode, doc){}};
	var responseMock;
	var expFail;

	setup(function(){
		responseMock = sinon.mock(response);
		expFail = responseMock.expects('fail').once().withExactArgs(403, 'Invalid auth card');

		eyeosAuth = new EyeosAuth();
		eyeosAuthMock = sinon.mock(eyeosAuth);
		expVerifyRequest = eyeosAuthMock.expects('verifyRequest').once().withExactArgs(request).returns(false);
		sut = new AuthFilterByCard(eyeosAuth);
	});

	teardown(function() {
		responseMock.restore();
	});

	suite('#filter', function(){
		test('Should call verifyRequest passing the request', function(){
			sut.filter(request, response);
			expVerifyRequest.verify();
		});
		test('If card is not correct, response.fail should be called with 403 and reason', function () {
			sut.filter(request, response);
			expFail.verify();
		});
		test('Return wether the card is valid or not', function () {
			var rValue = sut.filter(request, response);
			assert.ok(rValue, 'filter should return true since we are filtering the request');
		});
		test('It should return false since the request is NOT filtered out', function () {
			expVerifyRequest.returns(true);
			rValue = sut.filter(request, response);
			assert.notOk(rValue, 'filter should return false since we are NOT filtering');
		});
	});
});