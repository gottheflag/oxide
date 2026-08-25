import assert from "node:assert/strict";
import { createHmac } from "node:crypto";

import {
	HMAC
} from "../src/hmac/index.js";


//
// Empty key + empty message
//

{
	const expected =
		createHmac(
			"sha256",
			new Uint8Array()
		)
			.update(
				new Uint8Array()
			)
			.digest("hex");

	assert.equal(
		HMAC.sha256(
			new Uint8Array()
		)
			.digest("hex"),
		expected,
		"empty key + empty message"
	);
}


//
// Exact block-size key
//

{
	const key =
		Uint8Array.from(
			{ length: 64 },
			(_, index) =>
				(index * 17 + 3) & 0xff
		);

	const message =
		"exact block-size key";

	const expected =
		createHmac(
			"sha256",
			key
		)
			.update(message)
			.digest("hex");

	assert.equal(
		HMAC.sha256(key)
			.update(message)
			.digest("hex"),
		expected,
		"exact SHA-256 block-size key"
	);
}


//
// Binary key + binary message
//

{
	const key =
		Uint8Array.from([
			0x00,
			0xff,
			0x80,
			0x7f,
			0x01,
			0x00,
			0xaa,
			0x55
		]);

	const message =
		Uint8Array.from([
			0x00,
			0x01,
			0x02,
			0xff,
			0x80,
			0x00,
			0xfe
		]);

	const expected =
		createHmac(
			"sha512",
			key
		)
			.update(message)
			.digest("hex");

	assert.equal(
		HMAC.sha512(key)
			.update(message)
			.digest("hex"),
		expected,
		"binary key + binary message"
	);
}


//
// Empty updates must be harmless
//

{
	const expected =
		HMAC.sha256("secret")
			.update("message")
			.digest("hex");

	const actual =
		HMAC.sha256("secret")
			.update(
				new Uint8Array()
			)
			.update("message")
			.update(
				new Uint8Array()
			)
			.digest("hex");

	assert.equal(
		actual,
		expected,
		"empty updates must not affect HMAC"
	);
}


//
// Repeated digest() must remain stable
//

{
	const hmac =
		HMAC.sha256("secret")
			.update("message");

	const first =
		hmac.digest("hex");

	const second =
		hmac.digest("hex");

	assert.equal(
		first,
		second,
		"repeated digest() must be idempotent"
	);
}


//
// update() after digest() must fail
//

{
	const hmac =
		HMAC.sha256("secret")
			.update("message");

	hmac.digest();

	assert.throws(
		() =>
			hmac.update("again"),
		/Hash already finalized/
	);
}


//
// Returned digest bytes must be independent
//

{
	const hmac =
		HMAC.sha256("secret")
			.update("message");

	const first =
		hmac.digest();

	const second =
		hmac.digest();

	assert.notStrictEqual(
		first,
		second,
		"digest() must return a fresh Uint8Array"
	);

	assert.deepEqual(
		first,
		second
	);

	first[ 0 ] ^= 0xff;

	assert.notDeepEqual(
		first,
		second,
		"mutating one digest must not affect another"
	);
}


//
// Caller key mutation after construction
// must not affect the HMAC instance.
//

{
	const key =
		Uint8Array.from([
			1,
			2,
			3,
			4,
			5,
			6,
			7,
			8
		]);

	const originalKey =
		key.slice();

	const hmac =
		HMAC.sha256(key);

	key.fill(0xff);

	const actual =
		hmac
			.update("message")
			.digest("hex");

	const expected =
		createHmac(
			"sha256",
			originalKey
		)
			.update("message")
			.digest("hex");

	assert.equal(
		actual,
		expected,
		"mutating the caller's key must not affect the HMAC instance"
	);
}