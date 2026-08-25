import assert from "node:assert/strict";

import {
	SHA512_224
} from "../src/sha512-224/index.js";

const vectors = [
	{
		name: "empty input",
		input: "",
		expected:
			"6ed0dd02806fa89e25de060c19d3ac86" +
			"cabb87d6a0ddd05c333b84f4"
	},
	{
		name: "abc",
		input: "abc",
		expected:
			"4634270f707b6a54daae7530460842e2" +
			"0e37ed265ceee9a43e8924aa"
	}
];

for (const vector of vectors) {
	assert.equal(
		new SHA512_224()
			.update(vector.input)
			.digest("hex"),
		vector.expected,
		vector.name
	);
}

assert.equal(
	new SHA512_224(80)
		.update("abc")
		.digest("hex"),
	new SHA512_224()
		.update("abc")
		.digest("hex"),
	"explicit 80 rounds must equal the default"
);