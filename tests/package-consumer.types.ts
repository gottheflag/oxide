import {
	Hash
} from "@gottheflag/oxide";

import type {
	DigestEncoding,
	HashInput
} from "@gottheflag/oxide";

import {
	HMAC
} from "@gottheflag/oxide/hmac";

import {
	SHA1
} from "@gottheflag/oxide/sha1";

import {
	SHA224
} from "@gottheflag/oxide/sha224";

import {
	SHA256
} from "@gottheflag/oxide/sha256";

import {
	SHA384
} from "@gottheflag/oxide/sha384";

import {
	SHA512
} from "@gottheflag/oxide/sha512";

import {
	SHA512_224
} from "@gottheflag/oxide/sha512-224";

import {
	SHA512_256
} from "@gottheflag/oxide/sha512-256";


//
// Root API
//

const input: HashInput =
	new Uint8Array([
		0x61,
		0x62,
		0x63
	]);

const encoding: DigestEncoding =
	"hex";

void input;
void encoding;


//
// Algorithm types
//

const hmac =
	HMAC.sha256("secret");

const chainedHmac: HMAC =
	hmac
		.update("Hello")
		.update(" world");

const hmacBytes: Uint8Array =
	chainedHmac.digest();

const hmacHex: string =
	HMAC.sha512("secret")
		.update("message")
		.digest("hex");

const sha1: Hash =
	new SHA1();

const sha224: Hash =
	new SHA224();

const sha256: Hash =
	new SHA256();

const sha384: Hash =
	new SHA384();

const sha512: Hash =
	new SHA512();

const sha512224: Hash =
	new SHA512_224();

const sha512256: Hash =
	new SHA512_256();


void hmacBytes;
void hmacHex;
void sha1;
void sha224;
void sha256;
void sha384;
void sha512;
void sha512224;
void sha512256;


//
// Fluent update()
//

const chained: SHA256 =
	new SHA256()
		.update("abc")
		.update(
			new Uint8Array([
				1,
				2,
				3
			])
		);

void chained;


//
// digest() overloads
//

const defaultDigest: Uint8Array =
	new SHA256()
		.update("abc")
		.digest();

const bytesDigest: Uint8Array =
	new SHA256()
		.update("abc")
		.digest("bytes");

const hexDigest: string =
	new SHA256()
		.update("abc")
		.digest("hex");

void defaultDigest;
void bytesDigest;
void hexDigest;


//
// Accepted input forms
//

new SHA256()
	.update("text")
	.update(
		new ArrayBuffer(8)
	)
	.update(
		new Uint8Array(8)
	)
	.update(
		new Uint32Array(8)
	)
	.update(
		new DataView(
			new ArrayBuffer(8)
		)
	);


//
// Invalid public API usage must stay invalid.
//

// @ts-expect-error Arrays are not HashInput.
HMAC.sha256("secret").update([
	1,
	2,
	3
]);

// @ts-expect-error Invalid key input.
HMAC.sha256(123);

// @ts-expect-error Arrays are not HashInput.
new SHA256().update([
	1,
	2,
	3
]);

// @ts-expect-error Numbers are not HashInput.
new SHA256().update(123);

// @ts-expect-error Objects are not HashInput.
new SHA256().update({ value: "abc" });

// @ts-expect-error base64 is not a supported digest encoding.
new SHA256().digest("base64");