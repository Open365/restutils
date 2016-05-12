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
var HttpEventParser = require("../lib/httpEventParser.js");
var assert = require('chai').assert;

suite("HttpEventParser Suite", function () {
    var sut, req, testBody, dataFp, endFp, dataContext, endContext;
    var timesCalledData;

    setup(function() {
        timesCalledData=0;
        testBody=["testName=testValue", "&anotherName=anotherValue"];

        req = {
            url: '/',
            headers: {
                'test-header': 'test'
            },
            method: 'POST',
            on: function(command, fp, context) {
                if(command === "data") {
                    dataContext=context;
                    dataFp = fp;
                } else if(command === "end") {
                    endContext = context;
                    endFp = fp;
                }
            },
            data: function() {
                dataFp.call(dataContext, testBody[timesCalledData]);
                timesCalledData++;
            },
            end: function() {
                endFp.call(endContext);
            }
        };
        sut = new HttpEventParser();
    });

    test("parse called with request without body should call callback with correct data on request end", function (done) {
        var expectedReq = {
            "url": req.url,
            "method": req.method,
            "headers": req.headers,
            "body":""
        };
        sut.parse(req, function(serializedResponse){
            assert.equal(serializedResponse, JSON.stringify(expectedReq), "incorrect serialization for request without body");
            done();
        }, this);
        req.end();
    });

    test("parse called with request with GET parameters should add parameters to query", function(done) {
        req.url="/service/resource?parameter=value&anotherParameter=anotherValue";
        var expectedReq = {
            "url": "/service/resource",
            "method": req.method,
            "headers": req.headers,
            "body":"",
            "query":"parameter=value&anotherParameter=anotherValue"
        };

        sut.parse(req, function(serializedResponse){
            assert.equal(serializedResponse, JSON.stringify(expectedReq), "incorrect serialization for request without body");
            done();
        }, this);
        req.end();
    });

    test("parse called with request with body should call callback with correct data on request end", function(done) {
        var expectedReq = {
            "url": req.url,
            "method": req.method,
            "headers": req.headers,
            "body":"testName=testValue"
        };
        sut.parse(req, function(serializedResponse){
            assert.equal(serializedResponse, JSON.stringify(expectedReq), "incorrect serialization for request with data");
            done();
        }, this);
        req.data();
        req.end();
    });

    test("parse called with request with body sended in two chunks should call callbak with correct data on request end", function(done) {
        var expectedReq = {
            "url": req.url,
            "method": req.method,
            "headers": req.headers,
            "body":"testName=testValue&anotherName=anotherValue"
        };
        sut.parse(req, function(serializedResponse){
            assert.equal(serializedResponse, JSON.stringify(expectedReq), "incorrect serialization for request with data and two chunks");
            done();
        }, this);
        req.data();
        req.data();
        req.end();
    });
});
