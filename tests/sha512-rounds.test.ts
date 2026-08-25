import assert from "node:assert/strict";

import { SHA512 } from "../src/sha512/index.js";

const vectors = [
	{
		rounds: 1,
		expected:
			"60b9b520b0b9a6fd257194ed78877043" +
			"f7d6a1f8835f9f66e1bee8ad5db22f1" +
			"ca9d954b4289ba262ec13bb0bd924eef" +
			"0ba8942382680298a7b64a6c50ebfdee4"
	},
	{
		rounds: 16,
		expected:
			"74ea62eea4d4e57db5fe2d730a6b2763" +
			"809389a423f224cb0391167de735a305" +
			"f889ce830bbb4432225166eb95ed0b4e" +
			"a58ea94afafc2ccc29d48d0b9bbdeb52"
	},
	{
		rounds: 17,
		expected:
			"350200aa513cce3fc6482b0c35e2c3b0" +
			"3705726084357853e9748b6b847a6391" +
			"7efd1eeae7bcd0494280e48f89132d80" +
			"a6cfd80b65f05c9ae1eb9cb8133890da"
	},
	{
		rounds: 40,
		expected:
			"f80bc78dac129b2d6f2333c838021520" +
			"3c9aac57cc2d8d922e2f7aeb1b04ac05" +
			"5d7f5cc76850d94c4f9aff4e3b2a13fd" +
			"8631a94e44ee3928eba09d2f3f3d67ee"
	},
	{
		rounds: 79,
		expected:
			"7ae3ab2c1d1262fe91dfb5610fdf2db2" +
			"a1bded1eeacd94d46de603a64781f007" +
			"ecc3261726a7026fc0ced303943996c2" +
			"ee3dd5e28d104091f530e6c012b9c557"
	},
	{
		rounds: 80,
		expected:
			"ddaf35a193617abacc417349ae204131" +
			"12e6fa4e89a97ea20a9eeee64b55d39a" +
			"2192992a274fc1a836ba3c23a3feebbd" +
			"454d4423643ce80e2a9ac94fa54ca49f"
	}
];

for (const vector of vectors) {
	assert.equal(
		new SHA512(vector.rounds)
			.update("abc")
			.digest("hex"),
		vector.expected,
		`${vector.rounds} rounds`
	);
}

for (const rounds of [
	0,
	-1,
	81
]) {
	assert.throws(
		() => new SHA512(rounds),
		RangeError
	);
}

for (const rounds of [
	1.5,
	NaN,
	Infinity,
	-Infinity
]) {
	assert.throws(
		() => new SHA512(rounds),
		TypeError
	);
}

assert.throws(
	() => new SHA512(
		"80" as unknown as number
	),
	TypeError
);