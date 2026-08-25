import assert from "node:assert/strict";

import {
	expandSHA2_64Schedule
} from "../src/sha2/64/schedule.js";

const MASK =
	0xffffffffffffffffn;

function rotr(
	value: bigint,
	bits: bigint
): bigint {
	return (
		(value >> bits) |
		(value << (64n - bits))
	) & MASK;
}

function sigma0(
	value: bigint
): bigint {
	return (
		rotr(value, 1n) ^
		rotr(value, 8n) ^
		(value >> 7n)
	) & MASK;
}

function sigma1(
	value: bigint
): bigint {
	return (
		rotr(value, 19n) ^
		rotr(value, 61n) ^
		(value >> 6n)
	) & MASK;
}

function read64(
	bytes: Uint8Array,
	offset: number
): bigint {
	let value = 0n;

	for (let i = 0; i < 8; i++) {
		value =
			(value << 8n) |
			BigInt(bytes[ offset + i ]);
	}

	return value;
}

function expectedSchedule(
	block: Uint8Array
): bigint[] {
	const schedule =
		new Array<bigint>(80);

	for (let t = 0; t < 16; t++) {
		schedule[ t ] =
			read64(block, t * 8);
	}

	for (let t = 16; t < 80; t++) {
		schedule[ t ] = (
			sigma1(schedule[ t - 2 ]) +
			schedule[ t - 7 ] +
			sigma0(schedule[ t - 15 ]) +
			schedule[ t - 16 ]
		) & MASK;
	}

	return schedule;
}

function run(
	block: Uint8Array
): void {
	const high =
		new Uint32Array(80);

	const low =
		new Uint32Array(80);

	expandSHA2_64Schedule(
		block,
		0,
		high,
		low,
		80
	);

	const expected =
		expectedSchedule(block);

	for (let t = 0; t < 80; t++) {
		const actual = (
			(BigInt(high[ t ]) << 32n) |
			BigInt(low[ t ])
		);

		assert.equal(
			actual,
			expected[ t ],
			`schedule word ${t}`
		);
	}
}

// All zeros.
run(
	new Uint8Array(128)
);

// Sequential bytes.
run(
	Uint8Array.from(
		{ length: 128 },
		(_, index) => index
	)
);

// More carry-heavy data.
run(
	Uint8Array.from(
		{ length: 128 },
		(_, index) =>
			(index * 197 + 251) & 0xff
	)
);