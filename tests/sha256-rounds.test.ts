import assert from "node:assert/strict";

import { SHA256 } from "../src/sha256/index.js";

const vectors = [
	{
		rounds: 1,
		expected:
			"c774d234257194ecf7d6a1f7e1bee8ac" +
			"4b3898a1ec13bb0bba8942377b64a6c4",
	},
	{
		rounds: 16,
		expected:
			"1b0409f57bcc0e6315a1de882ce11eca" +
			"5867604ca6985a9893de22897a384f31",
	},
	{
		rounds: 17,
		expected:
			"8be481026c61d213fcd353507e82e050" +
			"d142751ba25e76592b16cbb7d03b15f7",
	},
	{
		rounds: 32,
		expected:
			"ddbd225ca600d8a7dc74fea2db847803" +
			"0b6763919c0f13c6cd6b6de2bcf370d0",
	},
	{
		rounds: 63,
		expected:
			"3da407ccc039fbf1f4cd205b5bfe8539" +
			"4c20648f2f928e42b5a3223f0dfc7a56",
	},
	{
		rounds: 64,
		expected:
			"ba7816bf8f01cfea414140de5dae2223" +
			"b00361a396177a9cb410ff61f20015ad",
	},
];

for (const vector of vectors) {
	assert.equal(
		new SHA256(vector.rounds)
			.update("abc")
			.digest("hex"),
		vector.expected,
		`${vector.rounds}-round SHA-256 failed`
	);
}

for (const rounds of [
	0,
	-1,
	65,
	1.5,
	NaN,
	Infinity,
	-Infinity,
]) {
	assert.throws(
		() => new SHA256(rounds),
		/rounds must/
	);
}

assert.throws(
	() => new SHA256(
		"64" as unknown as number
	),
	/rounds must be an integer/
);