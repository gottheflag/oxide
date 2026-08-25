import assert from "node:assert/strict";
import { createHmac } from "node:crypto";

import {
	HMAC
} from "../src/hmac/index.js";

function nodeHmac(
	algorithm: string,
	key: Uint8Array,
	message: Uint8Array
): string {
	return createHmac(
		algorithm,
		key
	)
		.update(message)
		.digest("hex");
}

const message = Uint8Array.from(
	{ length: 333 },
	(_, index) =>
		(index * 149 + 37) & 0xff
);

const cases = [
	{
		name: "sha1",
		blockSize: 64,
		create: (key: Uint8Array) =>
			HMAC.sha1(key),
	},
	{
		name: "sha224",
		blockSize: 64,
		create: (key: Uint8Array) =>
			HMAC.sha224(key),
	},
	{
		name: "sha256",
		blockSize: 64,
		create: (key: Uint8Array) =>
			HMAC.sha256(key),
	},
	{
		name: "sha384",
		blockSize: 128,
		create: (key: Uint8Array) =>
			HMAC.sha384(key),
	},
	{
		name: "sha512",
		blockSize: 128,
		create: (key: Uint8Array) =>
			HMAC.sha512(key),
	},
	{
		name: "sha512-224",
		blockSize: 128,
		create: (key: Uint8Array) =>
			HMAC.sha512_224(key),
	},
	{
		name: "sha512-256",
		blockSize: 128,
		create: (key: Uint8Array) =>
			HMAC.sha512_256(key),
	},
];

for (const testCase of cases) {
	for (const keyLength of [
		testCase.blockSize,
		testCase.blockSize + 1,
		testCase.blockSize * 2 + 17
	]) {
		const key = Uint8Array.from(
			{ length: keyLength },
			(_, index) =>
				(index * 193 + 91) & 0xff
		);

		const expected =
			nodeHmac(
				testCase.name,
				key,
				message
			);

		const actual =
			testCase
				.create(key)
				.update(message)
				.digest("hex");

		assert.equal(
			actual,
			expected,
			`${testCase.name} failed with ${keyLength}-byte key`
		);
	}
}