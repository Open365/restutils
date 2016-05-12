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

var sinon = require("sinon");
var WebServer = require('../lib/webServer.js'),
    HttpEventParser = require('../lib/httpEventParser.js'),
    RestController = require('../lib/restController.js');
var http = require('http');
var ServiceResponse = require('../lib/serviceResponse.js');

suite("WebServer Suite", function () {
    var sut, server, serverMock, httpEventParser, httpEventParserMock, req = 'req',
        requestJson = '{key:value}', restController, restControllerMock;
    var expListenListen, expListenParse, expListenHandle, testResponse, port;

    setup(function() {
        port = 8080,
        testResponse = new ServiceResponse();
        restController = new RestController();
        restControllerMock = sinon.mock(restController);
        httpEventParser = new HttpEventParser();
        httpEventParserMock = sinon.mock(httpEventParser);
        server = http.createServer();
        serverMock = sinon.mock(server);
        sut = new WebServer(restController, port, server, httpEventParser);
        sut.createServiceResponse=function(res) {
            return testResponse;
        }
    });

    test("listen should call listen on server with correct port", function () {
        setExpectationsOnListen();
        sut.listen();
        expListenListen.verify();
    });

    test("httpServer stop should call stop on server", function() {
        var expectation = serverMock.expects('close').once();
        sut.stop();
        expectation.verify();
    });

    test("listen should call httpEventParser parse on server event", function() {
        setExpectationsOnListen();
        sut.listen();
        server.emit('request', req, 'res');
        expListenParse.verify();
    });

    test("listen should call restController handle", function() {
        var requestJson = "a json";
        expListenListen = serverMock.expects('listen')
            .once().withExactArgs(port, sinon.match.func);
        expListenHandle = restControllerMock.expects('handle')
            .once().withExactArgs(requestJson, testResponse);
        var stub = sinon.stub(httpEventParser, 'parse', function(req, cb, context) {
            cb.call(context, requestJson);
        });
        sut.listen();
        server.emit('request', req, 'res');

    });


    function setExpectationsOnListen() {
        expListenListen = serverMock.expects('listen')
            .once().withExactArgs(port, sinon.match.func);
        expListenParse = httpEventParserMock.expects('parse')
            .once().withExactArgs(req, sinon.match.func, server).returns(requestJson);
        expListenHandle = restControllerMock.expects('handle')
            .once().withExactArgs(requestJson);
    }
});
