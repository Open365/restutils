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

"use strict";
/**
 * AMQPBinder Integration Tests.
 * work in lazy mode:
 * if a rabbitmq is available with default settings in localhost, test is executed.
 * if rabbitmq is not available, test is skipped.
 */
var sinon = require('sinon');
var assert = require('chai').assert;
var request = require('request');
var AMQPBinder = require('../lib/implementations/amqp/AMQPBinder');
var settings = {
    queue: {
        name: 'dummy',
        durable: true,
        exclusive: false,
        autoDelete: false
    },
    subscription: {
        ack: true
    },
    bindTo: [
        {
            exchangeName: "super.exchange.v1",
            routingKey: "super-routing",
            options: {
                type: 'direct',
                durable: true
            }

        }
    ]
};

function assertQueueAndExchangeExistAndBinded(queueName, exchangeSettings, done) {
    var queueExists = false,
        exchangeExists = false,
        bothBinded = false;

    request.get('http://guest:guest@localhost:15672/api/queues/%2f/' + queueName, function (error, response, body) {
        if (error || response.statusCode !== 200) {
            queueExists = false;
            assert.isTrue(queueExists);
        }
        queueExists = true;
        var exchangeName = exchangeSettings.exchangeName;
        request('http://guest:guest@localhost:15672/api/exchanges/%2f/' + exchangeName, function (error, response, body) {
            if (error || response.statusCode !== 200) {
                exchangeExists = false;
                assert.isTrue(exchangeExists);
            }
            exchangeExists = true;
            request('http://guest:guest@localhost:15672/api/queues/%2f/'+queueName+'/bindings' , function (error, response, body) {
                var queueBindngs = JSON.parse(body);
                if (error || response.statusCode !== 200) {
                    bothBinded = false;
                    assert.isTrue(bothBinded);
                }
                bothBinded = queueBindngs.some(function(binding){
                                                return binding.source === exchangeName && binding.destination === queueName});

                assert.isTrue(queueExists && exchangeExists );
                done()
            });
        });

    });
}




suite('AMQPBinder.integration', function(){
    var sut,
        rabbitAvailable = false,
        connection,
        queue;

    setup(function(done){
        try {
            sut = new AMQPBinder();
            connection = require('amqp').createConnection({host:'localhost', port: 5672, login:'guest', password:'guest'});
            connection.on('ready', function(){
                connection.queue(settings.queue.name, settings.queue, function(createdQueue){
                    queue = createdQueue;
                    rabbitAvailable = true;
                    done();
                });
            });
            connection.on('error', function(err){
                console.error('********************* Skipping AMQPBinder.integration test due to error: ', err);
                done();
            });

        } catch (err){
            console.error('********************* Skipping AMQPBinder.integration test due to error: ', err);
        }
    });
    suite('#AMQPBinder.bindExchangeToQueue', function(){
        test('Should create the exchange and bind it to queue', function(done){
            if(! rabbitAvailable){
                console.error('********************* Skipping AMQPBinder.integration test due to Rabbit not available. THIS IS NOT AN ERROR.');
                done();
                return;
            }
            sut.bindExchangeToQueue(connection, settings.bindTo[0], queue);

            assertQueueAndExchangeExistAndBinded(settings.queue.name, settings.bindTo[0], done);
        });
    });

});

