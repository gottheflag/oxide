import assert from "node:assert/strict";

import { SHA2_64 } from "../src/sha2/64/sha2.js";

class CaptureSHA2_64 extends SHA2_64 {
	public readonly blocks: Uint8Array[] = [];

	constructor() {
		super(
			new Uint32Array(16),
			16,
			80,
			"Test SHA-2/64"
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

	protected serializeDigest(): Uint8Array {
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

// "abc"

{
	const hash = new CaptureSHA2_64();

	hash.update("abc");
	hash.digest();

	assert.equal(
		hash.blocks.length,
		1
	);

	const block = hash.blocks[ 0 ];

	assert.deepEqual(
		Array.from(block.slice(0, 4)),
		[
			0x61,
			0x62,
			0x63,
			0x80
		]
	);

	for (let i = 4; i < 124; i++) {
		assert.equal(
			block[ i ],
			0,
			`expected zero at ${i}`
		);
	}

	// "abc" = 24 bits
	assert.equal(
		readUint32BE(block, 124),
		24
	);
}

// 111 bytes:
// padding + length still fit in one block.

{
	const hash = new CaptureSHA2_64();

	hash.update(
		new Uint8Array(111)
	);

	hash.digest();

	assert.equal(
		hash.blocks.length,
		1
	);

	assert.equal(
		hash.blocks[ 0 ][ 111 ],
		0x80
	);

	assert.equal(
		readUint32BE(
			hash.blocks[ 0 ],
			124
		),
		111 * 8
	);
}

// 112 bytes:
// padding forces a second block.

{
	const hash = new CaptureSHA2_64();

	hash.update(
		new Uint8Array(112)
	);

	hash.digest();

	assert.equal(
		hash.blocks.length,
		2
	);

	assert.equal(
		hash.blocks[ 0 ][ 112 ],
		0x80
	);

	assert.equal(
		readUint32BE(
			hash.blocks[ 1 ],
			124
		),
		112 * 8
	);
}

// Exact 128-byte block + padding block.

{
	const hash = new CaptureSHA2_64();

	hash.update(
		new Uint8Array(128)
	);

	hash.digest();

	assert.equal(
		hash.blocks.length,
		2
	);

	assert.equal(
		hash.blocks[ 1 ][ 0 ],
		0x80
	);

	assert.equal(
		readUint32BE(
			hash.blocks[ 1 ],
			124
		),
		128 * 8
	);
}