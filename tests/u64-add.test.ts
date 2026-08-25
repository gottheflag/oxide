import assert from "node:assert/strict";

const UINT32 =
	0x100000000;

function split64(value: bigint): {
	high: number;
	low: number;
} {
	return {
		high: Number(
			(value >> 32n) & 0xffffffffn
		),
		low: Number(
			value & 0xffffffffn
		)
	};
}

function add(
	words: readonly bigint[]
): {
	high: number;
	low: number;
} {
	let highSum = 0;
	let lowSum = 0;

	for (const word of words) {
		const {
			high,
			low
		} = split64(word);

		highSum += high;
		lowSum += low;
	}

	return {
		high: (
			highSum +
			Math.floor(
				lowSum / UINT32
			)
		) >>> 0,

		low:
			lowSum >>> 0
	};
}

const MASK =
	0xffffffffffffffffn;

const cases = [
	[
		0n,
		0n
	],
	[
		1n,
		1n
	],
	[
		0xffffffffn,
		1n
	],
	[
		0xffffffffffffffffn,
		1n
	],
	[
		0xffffffffffffffffn,
		0xffffffffffffffffn
	],
	[
		0x0123456789abcdefn,
		0xfedcba9876543210n
	],
	[
		0xffffffffffffffffn,
		0xffffffffffffffffn,
		0xffffffffffffffffn
	],
	[
		0xffffffffffffffffn,
		0xffffffffffffffffn,
		0xffffffffffffffffn,
		0xffffffffffffffffn,
		0xffffffffffffffffn
	]
];

for (const words of cases) {
	const actual =
		add(words);

	const expectedValue =
		words.reduce(
			(sum, word) =>
				(sum + word) & MASK,
			0n
		);

	const expected =
		split64(expectedValue);

	assert.deepEqual(
		actual,
		expected,
		words
			.map(
				word =>
					`0x${word.toString(16)}`
			)
			.join(" + ")
	);
}