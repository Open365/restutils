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
var HTTPRequestMarshaller = require('../lib/routers/HTTPRequestMarshaller');

suite('HTTPRequestMarshaller', function(){
	var sut;

	var userPath = '/foo/bar',
		method = 'GET',
		document = '{"foo": "bar"}',
	    rawQuery = 'conditions={%22$and%22:[{%22groupId%22:%225488725552109080656287af%22},{%22memberId%22:{%22$in%22:[%22dani.ametller%22]}}]}';

	var headers = {
		foo: 'bar'
	};
	var settings = {
		hostname: 'foo.bar',
		port: 33333
	};
	var restUtilsRequest = {
		method: method,
		userPath: userPath,
		document: document,
		headers: headers,
		rawQuery: rawQuery
	};
	var options = {};
	setup(function(){
		options = {
			method: method,
			path: userPath + '?' + rawQuery,
			body: document,
			headers: headers,
			hostname: settings.hostname,
			port: settings.port
		};
		sut = new HTTPRequestMarshaller(settings);
	});

	suite('#getRequest', function(){
		test('Should return a correctly initialized HTTPRequest', function(){
			var request = sut.getRequest(restUtilsRequest);
			assert.deepEqual(request.getOptions(), options);
		});
		test('If the body is not a string but an object, stringify it', function () {
			restUtilsRequest.document = {x: 'y'};
			options.body = "{\"x\":\"y\"}";
			var request = sut.getRequest(restUtilsRequest);
			assert.deepEqual(request.getOptions(), options);
		});
	});
});