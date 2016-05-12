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

var camelToHTTPResponse = require('../lib/implementations/amqp/camelToHTTPResponse');

suite('camelToHTTPResponse', function () {
	var sut;
	var camelResponse = { document: { test: 'lol' }, status: 200 };
	var httpResponse = "HTTP/1.0 200 OK\r\n\r\n"+JSON.stringify(camelResponse.document);
	var camelResponse2 = { document: { test: 'lolero' }, status: 200 };
	var httpResponse2 = "HTTP/1.0 200 OK\r\n\r\n"+JSON.stringify(camelResponse2.document);
	var camelResponse404 = { document: { test: 'lolero' }, status: 404 };
	var httpResponse404 = "HTTP/1.0 404 Not Found\r\n\r\n"+JSON.stringify(camelResponse404.document);
	var camelResponse400 = { document: { test: 'lolero' }, status: 400 };
	var httpResponse400 = "HTTP/1.0 400 Bad Request\r\n\r\n"+JSON.stringify(camelResponse400.document);

	setup(function () {

	});

	suite('getHTTPResponse', function () {
		test('Should generate a valid HTTPResponse from a CamelResponse', function(){
			sut = new camelToHTTPResponse(camelResponse);
			var response = sut.getHTTPResponse();
			assert.equal(response, httpResponse, "Failed to generate a valid HTTPResponse");
		});

		test('Should generate a valid HTTPResponse for different messages', function(){
			sut = new camelToHTTPResponse(camelResponse2);
			var response = sut.getHTTPResponse();
			assert.equal(response, httpResponse2, "Failed to generate a valid HTTPResponse");
		});

		test('Should handle a 404 response codes', function(){
			sut = new camelToHTTPResponse(camelResponse404);
			var response = sut.getHTTPResponse();
			assert.equal(response, httpResponse404, "Failed to generate a valid HTTPResponse with 404 error");
		});

		test('Should handle a 400 response codes', function(){
			sut = new camelToHTTPResponse(camelResponse400);
			var response = sut.getHTTPResponse();
			assert.equal(response, httpResponse400, "Failed to generate a valid HTTPResponse with 400 error");
		});
	});
});