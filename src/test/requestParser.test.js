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

var assert = require('chai').assert;
var RequestParser = require('../lib/requestParser.js');

suite("RequestParser Suite", function () {
    var unserializedRequest, unserializedRequestNoUrlParameters, unserializedRequestQueryParameters, unserializedRequestJson,sut, url, method, headers, body, query;
    var service = "calendar";
    setup(function() {
        url = "/calendar/v1/calendars/1337/appointments/3333";
        method = "a method";
        headers = {"header1": "value1"};
        body = '{"info": {"public": false}}';
        bodyJson='testName={"data":[{"name":"value"}]}';
        query = "testQuery=testValue&anotherTestQuery=anotherTestValue";
        unserializedRequest = {
            "url": url,
            "method": method,
            "headers": headers,
            "body": body
        };

        unserializedRequestNoUrlParameters = {
            "url": "/"+service+"/",
            "method": method,
            "headers": headers,
            "body": body
        };

        unserializedRequestJson={
            "url": "/"+service+"/",
            "method": method,
            "headers": headers,
            "body": bodyJson
        };

        unserializedRequestQueryParameters = {
            "url": "/"+service+"/",
            "method": method,
            "headers": headers,
            "body": body,
            "query":query
        };




        sut = new RequestParser();
    });

    test("parse called with serializedRequest should return analyzedRequest", function(){
        var actual = sut.parse(JSON.stringify(unserializedRequest));
        var expected = {
            "service":service,
            "headers":headers,
            "method":method,
			"document": {
                "info": {
                    "public": false
                }
            },
            "parameters": {
				"calendars": "1337",
				"appointments": "3333"
            },
			"version" : "v1",
			"path": "/calendar/v1/calendars/1337/appointments/3333",
			"userPath": "/calendars/1337/appointments/3333"
        };
        assert.deepEqual(actual, expected);
    });

    test("parse called with serializedRequest without url parameters should return analyzedRequest", function() {
        var actual = sut.parse(JSON.stringify(unserializedRequestNoUrlParameters));
        var expected = {
            "service":service,
            "headers":headers,
            "method":method,
            "document":  {
                "info": {
                    "public": false
                }
            },
			"version" : undefined,
			"path": "/calendar/",
			"userPath": "/"
        };
        assert.deepEqual(actual, expected);
    });

    test("parse called with serializedRequest with queryParameters should return analyzedRequest", function() {
        var actual = sut.parse(JSON.stringify(unserializedRequestQueryParameters));
        var expected = {
            "service":service,
            "headers":headers,
            "method":method,
            "query":{
                "testQuery":"testValue",
                "anotherTestQuery":"anotherTestValue"
            },
			"rawQuery": query,
			"document":  {
                "info": {
                    "public": false
                }
            },
			"version" : undefined,
			"path": "/calendar/",
			"userPath": "/"
        };
        assert.deepEqual(actual, expected);
    });

    test("parse called with serializedRequest with parameters in serialized json format should return analyzedRequest", function() {
        var actual = sut.parse(JSON.stringify(unserializedRequestJson));
        var expected = {
            "service":service,
            "headers":headers,
            "method":method,
            "document": {
                "testName": {
                    "data": [
                        {
                            "name": "value"
                        }
                    ]
                }
            },
			"version" : undefined,
			"path": "/calendar/",
			"userPath": "/"
        };
        assert.deepEqual(actual, expected);
    });
});
