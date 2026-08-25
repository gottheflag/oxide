import assert from "node:assert/strict";

import {
	HMAC
} from "../src/hmac/index.js";

const key =
	new Uint8Array(20);

key.fill(0x0b);

const hmac =
	HMAC.sha256(key)
		.update("Hi There");

const expected =
	"b0344c61d8db38535ca8afceaf0bf12b" +
	"881dc200c9833da726e9376c2e32cff7";

assert.equal(
	hmac.digest("hex"),
	expected,
	"HMAC-SHA-256 RFC vector"
);

assert.equal(
	hmac.digest("hex"),
	expected,
	"repeated digest() must be idempotent"
);

assert.throws(
	() => hmac.update("again"),
	/Hash already finalized/
);

{
	const first =
		HMAC.sha256("secret")
			.update("message")
			.digest();

	const second =
		HMAC.sha256("secret")
			.update("message")
			.digest();

	assert.deepEqual(
		first,
		second
	);

	first[0] ^= 0xff;

	assert.notDeepEqual(
		first,
		second,
		"digest bytes must be independent"
	);
}