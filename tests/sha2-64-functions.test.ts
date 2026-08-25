import assert from "node:assert/strict";

import {
	bigSigma0High,
	bigSigma0Low,
	bigSigma1High,
	bigSigma1Low,
	smallSigma0High,
	smallSigma0Low,
	smallSigma1High,
	smallSigma1Low
} from "../src/sha2/64/functions.js";

const MASK =
	0xffffffffffffffffn;

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

function rotr(
	value: bigint,
	bits: bigint
): bigint {
	return (
		(value >> bits) |
		(value << (64n - bits))
	) & MASK;
}

function bigSigma0(value: bigint): bigint {
	return (
		rotr(value, 28n) ^
		rotr(value, 34n) ^
		rotr(value, 39n)
	) & MASK;
}

function bigSigma1(value: bigint): bigint {
	return (
		rotr(value, 14n) ^
		rotr(value, 18n) ^
		rotr(value, 41n)
	) & MASK;
}

function smallSigma0(value: bigint): bigint {
	return (
		rotr(value, 1n) ^
		rotr(value, 8n) ^
		(value >> 7n)
	) & MASK;
}

function smallSigma1(value: bigint): bigint {
	return (
		rotr(value, 19n) ^
		rotr(value, 61n) ^
		(value >> 6n)
	) & MASK;
}

const values = [
	0n,
	1n,
	0xffffffffffffffffn,
	0x0123456789abcdefn,
	0x8000000000000001n,
	0x6a09e667f3bcc908n,
	0xbb67ae8584caa73bn
];

for (const value of values) {
	const {
		high,
		low
	} = split64(value);

	let expected = split64(
		bigSigma0(value)
	);

	assert.equal(
		bigSigma0High(high, low),
		expected.high
	);

	assert.equal(
		bigSigma0Low(high, low),
		expected.low
	);

	expected = split64(
		bigSigma1(value)
	);

	assert.equal(
		bigSigma1High(high, low),
		expected.high
	);

	assert.equal(
		bigSigma1Low(high, low),
		expected.low
	);

	expected = split64(
		smallSigma0(value)
	);

	assert.equal(
		smallSigma0High(high, low),
		expected.high
	);

	assert.equal(
		smallSigma0Low(high, low),
		expected.low
	);

	expected = split64(
		smallSigma1(value)
	);

	assert.equal(
		smallSigma1High(high, low),
		expected.high
	);

	assert.equal(
		smallSigma1Low(high, low),
		expected.low
	);
}