import assert from "node:assert/strict";

import { SHA512 } from "../src/sha512/index.js";

const vectors = [
	{
		name: "empty input",
		input: "",
		expected:
			"cf83e1357eefb8bdf1542850d66d8007" +
			"d620e4050b5715dc83f4a921d36ce9ce" +
			"47d0d13c5d85f2b0ff8318d2877eec2" +
			"f63b931bd47417a81a538327af927da3e"
	},
	{
		name: "abc",
		input: "abc",
		expected:
			"ddaf35a193617abacc417349ae204131" +
			"12e6fa4e89a97ea20a9eeee64b55d39a" +
			"2192992a274fc1a836ba3c23a3feebbd" +
			"454d4423643ce80e2a9ac94fa54ca49f"
	}
];

for (const vector of vectors) {
	assert.equal(
		new SHA512()
			.update(vector.input)
			.digest("hex"),
		vector.expected,
		vector.name
	);
}

assert.equal(
	new SHA512(80)
		.update("abc")
		.digest("hex"),
	new SHA512()
		.update("abc")
		.digest("hex"),
	"explicit 80 rounds must equal the default"
);