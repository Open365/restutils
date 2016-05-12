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
var RestController = require('../lib/restController.js'),
    RequestParser = require('../lib/requestParser.js'),
    ServiceResponse = require('../lib/serviceResponse.js'),
    AuthFilterNothing = require('../lib/AuthFilterNothing');

var clock;

suite("RestController Suite", function () {

    var sut, requestParser, requestParserMock, unserializedRequest, url, method
        , service = 'testService', headers, body, serviceResponse, serviceResponseMock
        , authFilterNothing, authFilterNothingMock;
    var expHandleParse, testAnalyzedRequest, expResponse, expAuthFilter;

    var currentAnalyzedRequest;
    var currentResponse;

    var shouldEndResponse;

    var shouldFailResponse;


    function testCallback(analyzedRequest, response) {
        currentAnalyzedRequest = analyzedRequest;
        currentResponse = response;
        if(shouldEndResponse) {
            response.end("Finished", "test encoding");
        }

        if(shouldFailResponse) {
            response.fail(500,"FAILURE");
        }
    }

    setup(function () {
        clock = sinon.useFakeTimers();
        shouldEndResponse = false;
        shouldFailResponse = false;
        url = "/" + service;
        method = "a method";
        headers = {"header1": "value1"};
        body = "testName=testValue&anotherName=anotherValue";
        unserializedRequest = {
            "url": url,
            "method": method,
            "headers": headers,
            "body": body
        };
        testAnalyzedRequest = {
            "service": "testService",
            "headers": [],
            "method": "GET",
            "parameters": {}
        };

		authFilterNothing = new AuthFilterNothing();
		authFilterNothingMock = sinon.mock(authFilterNothing);
		expAuthFilter = authFilterNothingMock.expects('filter').returns(false);

        requestParser = new RequestParser();
        requestParserMock = sinon.mock(requestParser);
        serviceResponse = new ServiceResponse(function(){}, this);
        serviceResponseMock = sinon.mock(serviceResponse);

        sut = new RestController(testCallback, this, requestParser, authFilterNothing);
    });

    test("handle should call requestParser parse", function () {
        setExpectationHandle();
        sut.handle(JSON.stringify(unserializedRequest), serviceResponse);
        expHandleParse.verify();
    });

    test("handle when called with serialized request should call inner callback with analyzed response", function () {
        setExpectationHandle();
        sut.handle(JSON.stringify(unserializedRequest), serviceResponse);
        assert.equal(currentAnalyzedRequest, testAnalyzedRequest);
    });

    test("handle when called with serialized request and callback ends the response should respond the base response", function () {
        expResponse = serviceResponseMock.expects('end').withExactArgs({ code: 200, data: JSON.stringify("Finished"), "encoding": "test encoding" });
        setExpectationHandle();
        shouldEndResponse = true;
        sut.handle(JSON.stringify(unserializedRequest), serviceResponse);
        expResponse.verify();
    });

    test("handle when called with serialized request and callback fails the response should respond the base response", function () {
        expResponse = serviceResponseMock.expects('end').withExactArgs({ code: 500, data: JSON.stringify("FAILURE"), "encoding": "text/plain" });
        setExpectationHandle();
        shouldFailResponse = true;
        sut.handle(JSON.stringify(unserializedRequest), serviceResponse);
        expResponse.verify();
    });



    function setExpectationHandle() {
        expHandleParse = requestParserMock.expects('parse')
            .once().withExactArgs(JSON.stringify(unserializedRequest)).returns(testAnalyzedRequest);

    }
});
