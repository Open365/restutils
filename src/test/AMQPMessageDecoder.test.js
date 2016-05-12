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
var AMQPMessageDecoder = require('../lib/implementations/amqp/AMQPMessageDecoder');

suite('AMQPMessageDecoder', function(){
	var sut;

	var returnJson = {foo: "bar"};
	var buf = new Buffer(200);
	buf.write(JSON.stringify(returnJson));

	var bufMock;
	var msg = {data: buf}

	var json = {
		parse: function(){}
	};
	var jsonMock;

	var expToString, expJsonParse;

	setup(function(){
		//NOTE: Can't mock toString because a bug in sinon.

		/*bufMock = sinon.mock(buf);
		expToString = bufMock.expects('toString').once().withExactArgs('utf-8');*/

		jsonMock = sinon.mock(json);
		expJsonParse = jsonMock.expects('parse').once().returns(returnJson);

		sut = new AMQPMessageDecoder(json);
	});

	teardown(function(){
		jsonMock.restore();
	});

	suite('#decode', function(){
		test('Should call msg.data.toString', function(){
			sut.decode(msg);
// 			expToString.verify();//NOTE: But in sinon, can not test
		});
		test('Should call JSON.parse with value returned from toString', function () {
			sut.decode(msg);
			expJsonParse.verify();
		});
		test('Should return an object with property foo and bar', function () {
			var obj = sut.decode(msg);
			assert.equal(obj, returnJson);
		});
	});
});