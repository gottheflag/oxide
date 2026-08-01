import assert from "node:assert/strict";

import type {
	DigestEncoding,
	HashInput,
} from "../src/index.js";

import { SHA1 } from "../src/sha1/index.js";

const ABC_SHA1 =
	"a9993e364706816aba3e25717850c26c9cd0d89d";

function expectABC(
	input: HashInput
): void {
	assert.equal(
		new SHA1()
			.update(input)
			.digest("hex"),
		ABC_SHA1
	);
}

// String input

expectABC("abc");

// Uint8Array input

expectABC(
	Uint8Array.of(97, 98, 99)
);

// Node.js Buffer input

expectABC(
	Buffer.from("abc")
);

// ArrayBuffer input

expectABC(
	Uint8Array
		.of(97, 98, 99)
		.buffer
);

// Respect ArrayBufferView boundaries

const backing = Uint8Array.of(
	0xff,
	97,
	98,
	99,
	0xff
);

expectABC(
	backing.subarray(1, 4)
);

expectABC(
	new DataView(
		backing.buffer,
		1,
		3
	)
);

// Mixed streaming input types

const streaming = new SHA1();

streaming
	.update("a")
	.update(Uint8Array.of(98))
	.update(
		Uint8Array.of(99).buffer
	);

assert.equal(
	streaming.digest("hex"),
	ABC_SHA1
);

// Default output is bytes

const hash = new SHA1()
	.update("abc");

const firstBytes = hash.digest();

assert.ok(
	firstBytes instanceof Uint8Array
);

assert.equal(
	Buffer
		.from(firstBytes)
		.toString("hex"),
	ABC_SHA1
);

// Explicit bytes output

assert.equal(
	Buffer
		.from(hash.digest("bytes"))
		.toString("hex"),
	ABC_SHA1
);

// Repeated digest calls

assert.equal(
	hash.digest("hex"),
	ABC_SHA1
);

assert.equal(
	hash.digest("hex"),
	ABC_SHA1
);

// Returned byte arrays are independent

const secondBytes = hash.digest();

assert.notStrictEqual(
	firstBytes,
	secondBytes
);

firstBytes[ 0 ] = 0;

assert.equal(
	hash.digest("hex"),
	ABC_SHA1
);

// Updating after finalization

assert.throws(
	() => hash.update("more"),
	/Hash already finalized/
);

// Invalid JavaScript input

assert.throws(
	() => {
		new SHA1().update(
			null as unknown as HashInput
		);
	},
	/Hash input must be/
);

assert.throws(
	() => {
		new SHA1().update(
			[ 97, 98, 99 ] as unknown as HashInput
		);
	},
	/Hash input must be/
);

// Invalid JavaScript digest encoding

assert.throws(
	() => {
		new SHA1()
			.update("abc")
			.digest(
				"base64" as DigestEncoding
			);
	},
	/Unsupported digest encoding/
);