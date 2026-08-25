import assert from "node:assert/strict";
import { createRequire } from "node:module";

const expected = {
	sha1:
		"a9993e364706816aba3e25717850c26c9cd0d89d",

	sha224:
		"23097d223405d8228642a477bda255b3" +
		"2aadbce4bda0b3f7e36c9da7",

	sha256:
		"ba7816bf8f01cfea414140de5dae2223" +
		"b00361a396177a9cb410ff61f20015ad",

	sha384:
		"cb00753f45a35e8bb5a03d699ac65007" +
		"272c32ab0eded1631a8b605a43ff5bed" +
		"8086072ba1e7cc2358baeca134c825a7",

	sha512:
		"ddaf35a193617abacc417349ae204131" +
		"12e6fa4e89a97ea20a9eeee64b55d39a" +
		"2192992a274fc1a836ba3c23a3feebbd" +
		"454d4423643ce80e2a9ac94fa54ca49f",

	sha512224:
		"4634270f707b6a54daae7530460842e2" +
		"0e37ed265ceee9a43e8924aa",

	sha512256:
		"53048e2681941ef99b2e29b76b4c7dab" +
		"e4c2d0c634fc6d46e0e2f13107e7af23"
};

//
// ESM
//

{
	const { HMAC } =
		await import("@gottheflag/oxide/hmac");

	const { SHA1 } =
		await import("@gottheflag/oxide/sha1");

	const { SHA224 } =
		await import("@gottheflag/oxide/sha224");

	const { SHA256 } =
		await import("@gottheflag/oxide/sha256");

	const { SHA384 } =
		await import("@gottheflag/oxide/sha384");

	const { SHA512 } =
		await import("@gottheflag/oxide/sha512");

	const { SHA512_224 } =
		await import("@gottheflag/oxide/sha512-224");

	const { SHA512_256 } =
		await import("@gottheflag/oxide/sha512-256");


	assert.equal(
		HMAC.sha256("secret")
			.update("message")
			.digest("hex"),
		"8b5f48702995c1598c573db1e21866a9" +
		"b825d4a794d169d7060a03605796360b"
	);

	assert.equal(
		new SHA1().update("abc").digest("hex"),
		expected.sha1
	);

	assert.equal(
		new SHA224().update("abc").digest("hex"),
		expected.sha224
	);

	assert.equal(
		new SHA256().update("abc").digest("hex"),
		expected.sha256
	);

	assert.equal(
		new SHA384().update("abc").digest("hex"),
		expected.sha384
	);

	assert.equal(
		new SHA512().update("abc").digest("hex"),
		expected.sha512
	);

	assert.equal(
		new SHA512_224().update("abc").digest("hex"),
		expected.sha512224
	);

	assert.equal(
		new SHA512_256().update("abc").digest("hex"),
		expected.sha512256
	);
}

//
// CommonJS
//

{
	const require =
		createRequire(import.meta.url);

	const { HMAC } =
		require("@gottheflag/oxide/hmac");

	const { SHA1 } =
		require("@gottheflag/oxide/sha1");

	const { SHA224 } =
		require("@gottheflag/oxide/sha224");

	const { SHA256 } =
		require("@gottheflag/oxide/sha256");

	const { SHA384 } =
		require("@gottheflag/oxide/sha384");

	const { SHA512 } =
		require("@gottheflag/oxide/sha512");

	const { SHA512_224 } =
		require("@gottheflag/oxide/sha512-224");

	const { SHA512_256 } =
		require("@gottheflag/oxide/sha512-256");

	assert.equal(
		HMAC.sha256("secret")
			.update("message")
			.digest("hex"),
		"8b5f48702995c1598c573db1e21866a9" +
		"b825d4a794d169d7060a03605796360b"
	);

	assert.equal(
		new SHA1().update("abc").digest("hex"),
		expected.sha1
	);

	assert.equal(
		new SHA224().update("abc").digest("hex"),
		expected.sha224
	);

	assert.equal(
		new SHA256().update("abc").digest("hex"),
		expected.sha256
	);

	assert.equal(
		new SHA384().update("abc").digest("hex"),
		expected.sha384
	);

	assert.equal(
		new SHA512().update("abc").digest("hex"),
		expected.sha512
	);

	assert.equal(
		new SHA512_224().update("abc").digest("hex"),
		expected.sha512224
	);

	assert.equal(
		new SHA512_256().update("abc").digest("hex"),
		expected.sha512256
	);
}

console.log(
	"Package consumer tests passed."
);