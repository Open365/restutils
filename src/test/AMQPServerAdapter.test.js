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


var AMQPServerAdapter = require("../lib/implementations/amqp/AMQPServerAdapter.js");
var RestController = require("../lib/restController.js");

var sut;
var port = 1200;
var host = "localhost";

var fakeServer;
var restController;

function FakeServer() {
    this.start = function() {

    }
}

function constructSut() {
    restController = new RestController(function(analyzedRequest, response) {

    }, this);
    fakeServer = new FakeServer();
    sut = new AMQPServerAdapter(restController, port, host);
    sut.setInnerServer(fakeServer);
}

suite('AMQPServerAdapter suite', function(){


    setup(function() {
        currentRequest = null;
        currentResponse = null;
        currentRouter = null;
        currentSettings = null;
        constructSut();
    });

    test("start should call innerServer start", sinon.test(function() {
        this.mock(fakeServer).expects("start").once();
        sut.listen();
    }));

    test("call innerRouter dispatch with analyzed request and response should call to restControllerHandle", sinon.test(function(){
        var analyzedRequest = "analyzedRequest";
        var amqpResponse = "response";
        this.mock(restController).expects("handle").once().withExactArgs(analyzedRequest, amqpResponse);
        sut._router.dispatch(analyzedRequest, amqpResponse);
    }));
});
