import assert from "node:assert/strict";

import { SHA224 } from "../src/sha224/index.js";

const vectors = [
	{
		name: "empty input",
		input: "",
		expected:
			"d14a028c2a3a2bc9476102bb288234c4" +
			"15a2b01f828ea62ac5b3e42f",
	},
	{
		name: "abc",
		input: "abc",
		expected:
			"23097d223405d8228642a477bda255b3" +
			"2aadbce4bda0b3f7e36c9da7",
	},
	{
		name: "multi-block",
		input:
			"abcdbcdecdefdefgefghfghighijhijk" +
			"ijkljklmklmnlmnomnopnopq",
		expected:
			"75388b16512776cc5dba5da1fd890150" +
			"b0c6455cb4f58b1952522525",
	},
];

for (const vector of vectors) {
	assert.equal(
		new SHA224()
			.update(vector.input)
			.digest("hex"),
		vector.expected,
		vector.name
	);
}

assert.equal(
	new SHA224(64)
		.update("abc")
		.digest("hex"),
	new SHA224()
		.update("abc")
		.digest("hex"),
	"explicit 64 rounds must equal the default"
);