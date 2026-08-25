import assert from "node:assert/strict";

import { SHA256 } from "../src/sha256/index.js";

const vectors = [
	{
		name: "empty input",
		input: "",
		expected:
			"e3b0c44298fc1c149afbf4c8996fb924" +
			"27ae41e4649b934ca495991b7852b855",
	},
	{
		name: "abc",
		input: "abc",
		expected:
			"ba7816bf8f01cfea414140de5dae2223" +
			"b00361a396177a9cb410ff61f20015ad",
	},
	{
		name: "multi-block",
		input:
			"abcdbcdecdefdefgefghfghighijhijk" +
			"ijkljklmklmnlmnomnopnopq",
		expected:
			"248d6a61d20638b8e5c026930c3e6039" +
			"a33ce45964ff2167f6ecedd419db06c1",
	},
];

for (const vector of vectors) {
	assert.equal(
		new SHA256()
			.update(vector.input)
			.digest("hex"),
		vector.expected,
		vector.name
	);
}

assert.equal(
	new SHA256(64)
		.update("abc")
		.digest("hex"),
	new SHA256()
		.update("abc")
		.digest("hex"),
	"explicit 64 rounds must equal the default"
);