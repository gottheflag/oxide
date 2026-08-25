import assert from "node:assert/strict";

import {
	SHA512_256
} from "../src/sha512-256/index.js";

const vectors = [
	{
		name: "empty input",
		input: "",
		expected:
			"c672b8d1ef56ed28ab87c3622c511406" +
			"9bdd3ad7b8f9737498d0c01ecef0967a"
	},
	{
		name: "abc",
		input: "abc",
		expected:
			"53048e2681941ef99b2e29b76b4c7dab" +
			"e4c2d0c634fc6d46e0e2f13107e7af23"
	}
];

for (const vector of vectors) {
	assert.equal(
		new SHA512_256()
			.update(vector.input)
			.digest("hex"),
		vector.expected,
		vector.name
	);
}

assert.equal(
	new SHA512_256(80)
		.update("abc")
		.digest("hex"),
	new SHA512_256()
		.update("abc")
		.digest("hex"),
	"explicit 80 rounds must equal the default"
);