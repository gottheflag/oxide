import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import { SHA2_64 } from "../src/sha2/64/sha2.js";
import { SHA512 } from "../src/sha512/index.js";

const CHUNK_SIZE =
	64 * 1024;

const TOTAL_SIZE =
	16 * 1024 * 1024;

const chunk = Uint8Array.from(
	{ length: CHUNK_SIZE },
	(_, index) =>
		(index * 193 + 41) & 0xff
);

{
	const oxide = new SHA512();

	const node =
		createHash("sha512");

	for (
		let offset = 0;
		offset < TOTAL_SIZE;
		offset += CHUNK_SIZE
	) {
		oxide.update(chunk);
		node.update(chunk);
	}

	assert.equal(
		oxide.digest("hex"),
		node.digest("hex"),
		"SHA-512 must correctly track a large streamed message"
	);
}

class CaptureSHA2_64 extends SHA2_64 {
	public readonly blocks:
		Uint8Array[] = [];

	constructor() {
		super(
			new Uint32Array(16),
			16,
			80,
			"SHA-2/64 test"
		);
	}

	protected processBlock(
		block: Uint8Array,
		offset: number = 0
	): void {
		this.blocks.push(
			block.slice(
				offset,
				offset + 128
			)
		);
	}

	protected serializeDigest():
		Uint8Array {
		return new Uint8Array();
	}
}

function readUint32BE(
	bytes: Uint8Array,
	offset: number
): number {
	return (
		(bytes[ offset ] * 0x1000000) +
		(bytes[ offset + 1 ] << 16) +
		(bytes[ offset + 2 ] << 8) +
		bytes[ offset + 3 ]
	) >>> 0;
}

{
	const hash =
		new CaptureSHA2_64();

	const internal =
		hash as unknown as {
			bitLength0: number;
			bitLength1: number;
			bitLength2: number;
			bitLength3: number;
		};

	/*
	 * Start eight bits before a carry
	 * through three whole 32-bit limbs.
	 */
	internal.bitLength0 =
		0x01234567;

	internal.bitLength1 =
		0xffffffff;

	internal.bitLength2 =
		0xffffffff;

	internal.bitLength3 =
		0xfffffff8;

	hash.update(
		new Uint8Array(1)
	);

	hash.digest();

	const block =
		hash.blocks.at(-1)!;

	assert.equal(
		readUint32BE(block, 112),
		0x01234568
	);

	assert.equal(
		readUint32BE(block, 116),
		0
	);

	assert.equal(
		readUint32BE(block, 120),
		0
	);

	assert.equal(
		readUint32BE(block, 124),
		0
	);
}