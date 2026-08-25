import assert from "node:assert/strict";

import { SHA384 } from "../src/sha384/index.js";

const vectors = [
	{
		name: "empty input",
		input: "",
		expected:
			"38b060a751ac96384cd9327eb1b1e36a" +
			"21fdb71114be07434c0cc7bf63f6e1da" +
			"274edebfe76f65fbd51ad2f14898b95b"
	},
	{
		name: "abc",
		input: "abc",
		expected:
			"cb00753f45a35e8bb5a03d699ac65007" +
			"272c32ab0eded1631a8b605a43ff5bed" +
			"8086072ba1e7cc2358baeca134c825a7"
	}
];

for (const vector of vectors) {
	assert.equal(
		new SHA384()
			.update(vector.input)
			.digest("hex"),
		vector.expected,
		vector.name
	);
}

assert.equal(
	new SHA384(80)
		.update("abc")
		.digest("hex"),
	new SHA384()
		.update("abc")
		.digest("hex"),
	"explicit 80 rounds must equal the default"
);