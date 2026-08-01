import assert from "node:assert/strict";

import { SHA1 } from "../src/sha1/index.js";

interface Vector {
	name: string;
	input: string;
	expected: string;
}

const vectors: Vector[] = [
	{
		name: "empty input",
		input: "",
		expected:
			"da39a3ee5e6b4b0d3255bfef95601890afd80709",
	},
	{
		name: "abc",
		input: "abc",
		expected:
			"a9993e364706816aba3e25717850c26c9cd0d89d",
	},
	{
		name: "multi-block RFC vector",
		input:
			"abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq",
		expected:
			"84983e441c3bd26ebaae4aa1f95129e5e54670f1",
	},
	{
		name: "one million a characters",
		input: "a".repeat(1_000_000),
		expected:
			"34aa973cd4c4daa4f61eeb2bdbad27316534016f",
	},
];

for (const vector of vectors) {
	assert.equal(
		new SHA1()
			.update(vector.input)
			.digest("hex"),
		vector.expected,
		vector.name
	);
}

assert.equal(
	new SHA1(80)
		.update("abc")
		.digest("hex"),
	new SHA1()
		.update("abc")
		.digest("hex"),
	"explicit 80 rounds must equal the default"
);