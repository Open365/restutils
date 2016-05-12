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
var AMQPRawMessageDecoder = require('../lib/implementations/amqp/AMQPRawMessageDecoder');

suite('AMQPRawMessageDecoder', function(){
	var sut, camelObjectGet, getString, camelObjectGetWithoutParams, getStringWithoutParams;

	setup(function(){
		camelObjectGet = { service: 'lol',
			headers:
			{
				Accept: 'lol',
				'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.94 Safari/537.36',
				Connection: 'close',
				Host: 'localhost:8196',
				'Accept-Encoding': 'gzip, deflate, sdch',
				'Accept-Language': 'es-ES,es;q=0.8'
			},
			method: 'GET',
			version: 'lel',
			path: 'lol/lel',
			userPath: '/',
			rawQuery: 'a=b',
			query: { a: 'b' }
		};
		getString = "GET /lol/lel?a=b HTTP/1.0\r\nHost: localhost:8196\r\nConnection: close\r\nUser-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.94 Safari/537.36\r\nAccept: lol\r\nAccept-Encoding: gzip, deflate, sdch\r\nAccept-Language: es-ES,es;q=0.8\r\n\r\n";

		camelObjectGetWithoutParams = { service: 'lol',
			headers:
			{
				Accept: 'lol',
				'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.94 Safari/537.36',
				Connection: 'close',
				Host: 'localhost:8196',
				'Accept-Encoding': 'gzip, deflate, sdch',
				'Accept-Language': 'es-ES,es;q=0.8'
			},
			method: 'GET',
			version: 'lel',
			path: 'lol/lel',
			userPath: '/'
		};
		getStringWithoutParams = "GET /lol/lel HTTP/1.0\r\nHost: localhost:8196\r\nConnection: close\r\nUser-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.94 Safari/537.36\r\nAccept: lol\r\nAccept-Encoding: gzip, deflate, sdch\r\nAccept-Language: es-ES,es;q=0.8\r\n\r\n";
		sut = new AMQPRawMessageDecoder();
	});

	suite('#decode', function(){
		test('should convert a raw message from the request to camel-style object', function() {
			var obj = sut.decode(getString);
			assert.deepEqual(obj, camelObjectGet, "Failed to construct a valid camel-object from request");
		});

		test('should convert a raw message without parameters from the request to camel-style object', function() {
			var obj = sut.decode(getStringWithoutParams);
			assert.deepEqual(obj, camelObjectGetWithoutParams, "Failed to construct a valid camel-object from request");
		});
	});
});