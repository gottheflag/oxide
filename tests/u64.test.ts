import assert from "node:assert/strict";

import {
	rotr64High,
	rotr64Low,
	shr64High,
	shr64Low
} from "../src/utils/u64.js";

const MASK =
	0xffffffffffffffffn;

function join64(
	high: number,
	low: number
): bigint {
	return (
		(BigInt(high >>> 0) << 32n) |
		BigInt(low >>> 0)
	);
}

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

function rotateRight(
	value: bigint,
	bits: number
): bigint {
	const amount =
		BigInt(bits & 63);

	if (amount === 0n) {
		return value & MASK;
	}

	return (
		(value >> amount) |
		(value << (64n - amount))
	) & MASK;
}

const values = [
	0n,
	1n,
	0xffffffffffffffffn,
	0x0123456789abcdefn,
	0x8000000000000001n
];

const rotations = [
	0,
	1,
	7,
	8,
	31,
	32,
	33,
	63,
	64,
	65
];

for (const value of values) {
	const {
		high,
		low
	} = split64(value);

	for (const bits of rotations) {
		const expected =
			split64(
				rotateRight(value, bits)
			);

		assert.equal(
			rotr64High(
				high,
				low,
				bits
			),
			expected.high,
			`ROTR high failed for ${value.toString(16)} / ${bits}`
		);

		assert.equal(
			rotr64Low(
				high,
				low,
				bits
			),
			expected.low,
			`ROTR low failed for ${value.toString(16)} / ${bits}`
		);
	}
}

for (const value of values) {
	const {
		high,
		low
	} = split64(value);

	for (const bits of [
		0,
		1,
		7,
		31,
		32,
		33,
		63,
		64
	]) {
		const expected =
			split64(
				value >> BigInt(bits)
			);

		assert.equal(
			shr64High(
				high,
				low,
				bits
			),
			expected.high
		);

		assert.equal(
			shr64Low(
				high,
				low,
				bits
			),
			expected.low
		);
	}
}