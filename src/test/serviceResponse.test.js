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
var ServiceResponse = require('../lib/serviceResponse.js');

suite('ServiceResponse suite', function() {
    var sut, end, fail;

    setup(function() {
        end = sinon.spy();
        fail = sinon.spy();
        sut = new ServiceResponse(end, this, fail);
    });

    test("end should call injected callback", function() {
        sut.end("response");
        assert.isTrue(end.calledWith("response", "text/plain"));
    });

    test("end called with additional encoding should call injected callback with the encoding", function() {
        sut.end("response", "test encoding");
        assert.isTrue(end.calledWith("response", "test encoding"));
    });

    test("fail should call injected callback", function() {
        sut.fail(22, "fail");
        assert.isTrue(fail.calledWith(22, "fail", "text/plain"));
    });
});