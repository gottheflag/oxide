import assert from "node:assert/strict";

import { SHA1 } from "../src/sha1/index.js";

const vectors = [
	{
		rounds: 1,
		expected:
			"685c1f345712ce8a14ae47e0a8ed3174d4053666",
	},
	{
		rounds: 16,
		expected:
			"8802f93009399a00fd051aa321b4420fdc9905e9",
	},
	{
		rounds: 17,
		expected:
			"b5d77b24108b81b85f15d89b747c921bd554cf89",
	},
	{
		rounds: 20,
		expected:
			"64e3407ecc323ba6b96576c8e3d6ea7e8c02577b",
	},
	{
		rounds: 21,
		expected:
			"817cd3cbed6bc9060fd4010530dcee40977777f8",
	},
	{
		rounds: 40,
		expected:
			"9a233fbb3c660f8e8fd3c2cd14069c6cbb01ce22",
	},
	{
		rounds: 41,
		expected:
			"63cd01e022abc843ebe0f5ff074b3a45c7a729e6",
	},
	{
		rounds: 60,
		expected:
			"a698015bf9a53186cd539cd20243d6c59b6bf79b",
	},
	{
		rounds: 61,
		expected:
			"3e9be4482f2089e3db30be7d44cb144ab5e4643f",
	},
	{
		rounds: 79,
		expected:
			"be7df8e275dacd5500d94af4e9304b239b8cbc15",
	},
	{
		rounds: 80,
		expected:
			"a9993e364706816aba3e25717850c26c9cd0d89d",
	},
];

for (const vector of vectors) {
	assert.equal(
		new SHA1(vector.rounds)
			.update("abc")
			.digest("hex"),
		vector.expected,
		`${vector.rounds}-round SHA-1 failed`
	);
}

for (const rounds of [
	0,
	-1,
	81,
	1.5,
	NaN,
	Infinity,
	-Infinity,
]) {
	assert.throws(
		() => new SHA1(rounds),
		/rounds must/
	);
}

assert.throws(
	() => new SHA1(
		"80" as unknown as number
	),
	/rounds must be an integer/
);