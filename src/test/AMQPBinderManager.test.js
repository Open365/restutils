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

var Connection = require('amqp').Connection;
var AMQPBinderManager = require('../lib/implementations/amqp/AMQPBinderManager');
var AMQPBinder = require('../lib/implementations/amqp/AMQPBinder');
var settings = require('../lib/settings-test');

suite('AMQPBinderManager', function(){
    var sut;
    var amqpBinder, amqpBinderMock;
    var amqpQueueFake,
        connectionFake;

    setup(function(){
        amqpBinder = new AMQPBinder();
        amqpBinderMock = sinon.mock(amqpBinder);
        sut = new AMQPBinderManager(amqpBinder);

        connectionFake = 'connection';

        amqpQueueFake = 'queue';
    });

    suite('#bindExchangesToQueue', function(){
        setup(function(){

        });

        test('Should call amqpBinder.bindExchangeToQueue with the correct params.', function(){
            var expCallBindExchangeToQueue = amqpBinderMock.expects('bindExchangeToQueue').once().withExactArgs(connectionFake, settings.bindTo[0], amqpQueueFake);
            sut.bindExchangesToQueue(connectionFake, settings, amqpQueueFake);
            expCallBindExchangeToQueue.verify();
        });

        test('Should call amqpBinder.bindExchangeToQueue for each exchange in settings', function () {
            var expCallBindExchangeToQueueTwice = amqpBinderMock.expects('bindExchangeToQueue').twice();
            var moreSettings = {
                bindTo: [
                    {
                        exchangeName: "super.exchange.v1",
                        routingKey: "super-routing",
                        options: {
                            type: 'direct',
                            durable: true
                        }

                    },
                    {
                        exchangeName: "super.exchange2.v1",
                        routingKey: "super-routing-2",
                        options: {
                            type: 'direct',
                            durable: true
                        }

                    }
                ]
            };
            sut.bindExchangesToQueue(connectionFake, moreSettings, amqpQueueFake);
            expCallBindExchangeToQueueTwice.verify();
        });

        test('Should not call amqpBinder.bindExchangeToQueue when bindTo is null', function () {
            var expNotCallBindExchangeToQueue = amqpBinderMock.expects('bindExchangeToQueue').never();
            var moreSettings = {bindTo: null};
            sut.bindExchangesToQueue(connectionFake, moreSettings, amqpQueueFake);
            expNotCallBindExchangeToQueue.verify();
        });

        test('Should not call amqpBinder.bindExchangeToQueue when bindTo is not set', function () {
            var expNotCallBindExchangeToQueue = amqpBinderMock.expects('bindExchangeToQueue').never();
            var moreSettings = {};
            sut.bindExchangesToQueue(connectionFake, moreSettings, amqpQueueFake);
            expNotCallBindExchangeToQueue.verify();
        });

    });
});
