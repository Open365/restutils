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
var settings = require('../lib/settings-test');
var AMQPExchangeFactory = require('../lib/implementations/amqp/AMQPExchangeFactory');

suite('AMQPExchangeFactory', function () {
	var sut;

	var router = {dispatch: function(){}};
	var authFilter = {};
	var conn = {};

	setup(function () {
		sut = AMQPExchangeFactory;
	});

	suite('getExchange', function () {
		test('Should return an exchange initialized with connection', function () {
			var exchange = sut.getExchange(router, authFilter, conn, settings);
			assert.equal(exchange.getConnection(), conn);
		});
	});
});