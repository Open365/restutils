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
var AMQPAck = require('../lib/implementations/amqp/AMQPAck.js');

suite('AMQPAck', function(){
	var sut;

	var fakeNodeAmqp = {
		acknowledge: function(){},
		reject: function () {}
	};
	var fakeNodeAmqpMock;
	var expAcknowledge, expNotAcknowledge;

	var settings = {};

	setup(function(){
		settings.subscription = {ack: true};

		fakeNodeAmqpMock = sinon.mock(fakeNodeAmqp);
		expAcknowledge = fakeNodeAmqpMock.expects('acknowledge').once().withExactArgs();

		sut = new AMQPAck(fakeNodeAmqp, settings);
	});

	teardown(function() {
		fakeNodeAmqpMock.restore();
	});
	suite('#acknowledge', function(){
		test('Should call this.ack.acknowledge which is the nodeamqp library', function(){
			sut.acknowledge();
			expAcknowledge.verify();
		});
		test('If settings->subscription->ack equals false, then acknowledge should NOT be called', function () {
			settings.subscription = false;
			expAcknowledge.never();
			sut.acknowledge();
			expAcknowledge.verify();
		});
	});

	suite('#reject', function () {
		test("should call this.ack.reject", sinon.test(function () {
			var requeue = "fake requeue";
			this.mock(fakeNodeAmqp).expects('reject').once().withExactArgs(requeue);
			sut.reject(requeue);
		}));
	});
});
