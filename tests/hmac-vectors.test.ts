import assert from "node:assert/strict";

import {
	HMAC
} from "../src/hmac/index.js";


//
// RFC 2202 — HMAC-SHA-1
//

{
	const key =
		new Uint8Array(20);

	key.fill(0x0b);

	assert.equal(
		HMAC.sha1(key)
			.update("Hi There")
			.digest("hex"),
		"b617318655057264e28bc0b6fb378c8ef146be00",
		"RFC 2202 HMAC-SHA-1 test case 1"
	);
}


//
// RFC 4231 — Test Case 1
//
// Key: 0x0b repeated 20 times
// Data: "Hi There"
//

{
	const key =
		new Uint8Array(20);

	key.fill(0x0b);

	assert.equal(
		HMAC.sha224(key)
			.update("Hi There")
			.digest("hex"),
		"896fb1128abbdf196832107cd49df33f" +
		"47b4b1169912ba4f53684b22",
		"RFC 4231 HMAC-SHA-224 test case 1"
	);

	assert.equal(
		HMAC.sha256(key)
			.update("Hi There")
			.digest("hex"),
		"b0344c61d8db38535ca8afceaf0bf12b" +
		"881dc200c9833da726e9376c2e32cff7",
		"RFC 4231 HMAC-SHA-256 test case 1"
	);

	assert.equal(
		HMAC.sha384(key)
			.update("Hi There")
			.digest("hex"),
		"afd03944d84895626b0825f4ab46907f" +
		"15f9dadbe4101ec682aa034c7cebc59c" +
		"faea9ea9076ede7f4af152e8b2fa9cb6",
		"RFC 4231 HMAC-SHA-384 test case 1"
	);

	assert.equal(
		HMAC.sha512(key)
			.update("Hi There")
			.digest("hex"),
		"87aa7cdea5ef619d4ff0b4241a1d6cb0" +
		"2379f4e2ce4ec2787ad0b30545e17cde" +
		"daa833b7d6b8a702038b274eaea3f4e4" +
		"be9d914eeb61f1702e696c203a126854",
		"RFC 4231 HMAC-SHA-512 test case 1"
	);
}


//
// RFC 4231 — Test Case 2
//
// This also exercises a normal short ASCII key.
//

{
	const key =
		"Jefe";

	const message =
		"what do ya want for nothing?";

	assert.equal(
		HMAC.sha224(key)
			.update(message)
			.digest("hex"),
		"a30e01098bc6dbbf45690f3a7e9e6d0f" +
		"8bbea2a39e6148008fd05e44",
		"RFC 4231 HMAC-SHA-224 test case 2"
	);

	assert.equal(
		HMAC.sha256(key)
			.update(message)
			.digest("hex"),
		"5bdcc146bf60754e6a042426089575c7" +
		"5a003f089d2739839dec58b964ec3843",
		"RFC 4231 HMAC-SHA-256 test case 2"
	);

	assert.equal(
		HMAC.sha384(key)
			.update(message)
			.digest("hex"),
		"af45d2e376484031617f78d2b58a6b1b" +
		"9c7ef464f5a01b47e42ec3736322445e" +
		"8e2240ca5e69e2c78b3239ecfab21649",
		"RFC 4231 HMAC-SHA-384 test case 2"
	);

	assert.equal(
		HMAC.sha512(key)
			.update(message)
			.digest("hex"),
		"164b7a7bfcf819e2e395fbe73b56e0a3" +
		"87bd64222e831fd610270cd7ea250554" +
		"9758bf75c05a994a6d034f65f8f0e6fd" +
		"caeab1a34d4a6b4b636e070a38bce737",
		"RFC 4231 HMAC-SHA-512 test case 2"
	);
}