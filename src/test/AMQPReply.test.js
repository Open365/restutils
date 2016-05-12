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
var AMQPReply = require('../lib/implementations/amqp/AMQPReply');
var CamelToHTTPResponse = require('../lib/implementations/amqp/camelToHTTPResponse');

suite('AMQPReply', function(){
	var sut;

	var exchangeMock;
	var expExchangePublish;
	var amqpReplyConfirmation;

	var exchange = {
		publish: function(){}
	};

	var ack = {acknowledge: function(){}, reject: function () {}};
	var ackMock;
	var expAcknowledge;

	var deliveryInfo = {replyTo: "queue1", correlationId: "some-id-cool"};
	var publishOpts = {correlationId: deliveryInfo.correlationId, confirm: true};

	var status = 200;
	var document = {foo: "bar"};
	var camelToHTTPResponse, expResponseText, expExchangePublishRaw;

	setup(function(){
		camelToHTTPResponse = new CamelToHTTPResponse({document:document, status:status});
		expResponseText = camelToHTTPResponse.getHTTPResponse();
		exchangeMock = sinon.mock(exchange);
		ackMock = sinon.mock(ack);
		expAcknowledge = ackMock.expects('acknowledge').once().withExactArgs();

		expExchangePublish = exchangeMock.expects('publish').once()
		                                                    .withExactArgs(
                                                                deliveryInfo.replyTo,
                                                                {status: status, document: document},
                                                                publishOpts
                                                            );

		expExchangePublishRaw = exchangeMock.expects('publish').once()
			.withExactArgs(
			deliveryInfo.replyTo,
			expResponseText,
			publishOpts
		);

		sut = new AMQPReply(status, document, exchange, ack, deliveryInfo, settings);
	});

	teardown(function() {
		exchangeMock.restore();
		ackMock.restore();
	});

	suite('#send', function(){
		test('Should call this.exchagne.publish', function(){
			sut.send(document);
			expExchangePublish.verify();
		});
		test('Should call this.exchagne.publish with the response from camelToHTTPResponse if type is raw', function(){
			sut = new AMQPReply(status, document, exchange, ack, deliveryInfo, settings, "raw");
			sut.send(document);
			expExchangePublishRaw.verify();
		});
	});

	suite("#reject", function () {
		var requeue = "fake requeue";

		test("should call ack.reject when ack = true", sinon.test(function () {
			this.mock(ack)
				.expects("reject")
				.once()
				.withExactArgs(requeue);
			sut.reject(requeue);
		}));
		test("should not call ack.reject when ack = false", sinon.test(function () {
			settings.subscription.ack = false;
			this.mock(ack)
				.expects("reject")
				.never()
			sut.reject(requeue);
			settings.subscription.ack = true;
		}));
	});
});
