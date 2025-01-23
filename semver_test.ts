//
// semver is a semantic version number TypeScript module.
//
// Authors R. S. Doiel, <rsdoiel@caltech.edu>
//
// Copyright (c) 2025, Caltech
// All rights not granted herein are expressly reserved by Caltech.
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
//
// 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
import { assertEquals, assertNotEquals } from '@std/assert';
import * as semver from './semver.ts';


function testSemver() {
	let expected = "1.1.1";
	let sv = semver.NewSemver(1,1,1);
	let result = sv.toString();
	assertEquals(expected, result, `expected ${expected}, got ${result}`);

	for (let s of [ '1.1.1', '1.1', "2.0.0-next" ]) {
		expected = s;
		assertEquals(sv.parse(expected), true, `parse(${expected}) should return true`);
		result = sv.toString();
		assertEquals(expected, result, `expected ${expected}, got ${result}`);
	}

	for (let s of [ 'A1.2.3' ]) {
		expected = s;
		assertEquals(sv.parse(expected), false, `parse(${expected}) should return false`);
	}
}

function testIncrement() {
	let sv = semver.NewSemver(0, 0, 0);
	let expected = "v0.0.0";

	assertEquals(sv.parse(expected), true, `expected "${expected}" to parse`);
	let result = sv.toString();
	assertEquals(expected, result, `expected "${expected}", got "${result}"`);

	let pairs: {[key: string] : string} = {
		"0.0.1": "0.0.2"
	}
	for (let key of Object.keys(pairs)) {
		expected = pairs[key];
		assertEquals(sv.parse(key), true, `expected "${key}" to parse`);
		//assertEquals(sv.incPatch(), true, `expected incPath() for ${key} to return true`);
		sv.incPatch();
		result = sv.toString();
		assertEquals(expected, result, `expected "${expected}", got "${result}"`);
	}

	pairs = { "0.1.0": "0.2.0"};
	for (let key of Object.keys(pairs)) {
		expected = pairs[key];
		assertEquals(sv.parse(key), true, `expected "${key}" to parse`);
		//assertEquals(sv.incMinor(), true, `expected incMinor() for ${key} to return true`);
		sv.incMinor();
		result = sv.toString();
		assertEquals(expected, result, `expected "${expected}", got "${result}"`);
	}

	pairs = { "1.0.0": "2.0.0"};
	for (let key of Object.keys(pairs)) {
		expected = pairs[key];
		assertEquals(sv.parse(key), true, `expected "${key}" to parse`);
		//assertEquals(sv.incMajor(), true, `expected incMajor() for ${key} to return true`);
		sv.incMajor();
		result = sv.toString();
		assertEquals(expected, result, `expected "${expected}", got "${result}"`);
	}
}

if (import.meta.main) {
	testSemver();
	testIncrement();
} else {
	Deno.test("testSemver", testSemver);
	Deno.test("testIncrement", testIncrement);
}