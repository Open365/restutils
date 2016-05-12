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

var AMQPBinder = require('../lib/implementations/amqp/AMQPBinder');
var settings = require('../lib/settings-test');

suite('AMQPBinder', function(){
    var sut,
        amqpConnectionFake, amqpConnectionMock,
        amqpQueueFake, amqpQueueMock;

    setup(function(){
        sut = new AMQPBinder();
        amqpConnectionFake = {exchange: function(name, options, cb){cb()}};
        amqpQueueFake = {bind: function(){}};
        amqpQueueMock = sinon.mock(amqpQueueFake);
    });

    suite('#bindExchangeToQueue', function(){
        var expConnectionExchangeCalled,
            expQueueBindCalled;

        setup(function(){

            expQueueBindCalled = amqpQueueMock.expects('bind').once().withExactArgs(settings.bindTo[0].exchangeName, settings.bindTo[0].routingKey);
        });

        test('Should create the exchange by calling amqpConnection.exchange', function(){
            amqpConnectionMock = sinon.mock(amqpConnectionFake);
            expConnectionExchangeCalled = amqpConnectionMock.expects('exchange').once().withArgs(settings.bindTo[0].exchangeName, settings.bindTo[0].options);
            sut.bindExchangeToQueue(amqpConnectionFake, settings.bindTo[0], amqpQueueFake);
            expConnectionExchangeCalled.verify();
        });

        test('Should bind the queue and the created exchange by calling queue.bind', function () {
            sut.bindExchangeToQueue(amqpConnectionFake, settings.bindTo[0], amqpQueueFake);
            expQueueBindCalled.verify();
        });
    });
});
