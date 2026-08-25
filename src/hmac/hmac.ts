import {
	Hash
} from "../hash.js";

import type {
	HashConstructor
} from "../hash.js";

import type {
	HashInput
} from "../types/hash.js";

import {
	toBytes
} from "../utils/bytes.js";

import {
	SHA1
} from "../sha1/index.js";

import {
	SHA224
} from "../sha224/index.js";

import {
	SHA256
} from "../sha256/index.js";

import {
	SHA384
} from "../sha384/index.js";

import {
	SHA512
} from "../sha512/index.js";

import {
	SHA512_224
} from "../sha512-224/index.js";

import {
	SHA512_256
} from "../sha512-256/index.js";

export class HMAC extends Hash {
	private readonly HashType: HashConstructor;
	private readonly inner: Hash;
	private readonly outerPad: Uint8Array;

	private constructor(
		HashType: HashConstructor,
		key: HashInput
	) {
		super();

		this.HashType = HashType;

		const blockSize =
			HashType.blockSize;

		let keyBytes =
			toBytes(key);

		/*
		 * HMAC keys larger than the hash block
		 * are first reduced to H(key).
		 */
		if (keyBytes.length > blockSize) {
			keyBytes =
				new HashType()
					.update(keyBytes)
					.digest();
		}

		const innerPad =
			new Uint8Array(blockSize);

		const outerPad =
			new Uint8Array(blockSize);

		innerPad.fill(0x36);
		outerPad.fill(0x5c);

		for (
			let index = 0;
			index < keyBytes.length;
			index++
		) {
			innerPad[index] ^=
				keyBytes[index];

			outerPad[index] ^=
				keyBytes[index];
		}

		this.outerPad = outerPad;

		this.inner =
			new HashType()
				.update(innerPad);
	}

	public static sha1(
		key: HashInput
	): HMAC {
		return new HMAC(
			SHA1,
			key
		);
	}

	public static sha224(
		key: HashInput
	): HMAC {
		return new HMAC(
			SHA224,
			key
		);
	}

	public static sha256(
		key: HashInput
	): HMAC {
		return new HMAC(
			SHA256,
			key
		);
	}

	public static sha384(
		key: HashInput
	): HMAC {
		return new HMAC(
			SHA384,
			key
		);
	}

	public static sha512(
		key: HashInput
	): HMAC {
		return new HMAC(
			SHA512,
			key
		);
	}

	public static sha512_224(
		key: HashInput
	): HMAC {
		return new HMAC(
			SHA512_224,
			key
		);
	}

	public static sha512_256(
		key: HashInput
	): HMAC {
		return new HMAC(
			SHA512_256,
			key
		);
	}

	protected absorb(
		data: Uint8Array
	): void {
		this.inner.update(data);
	}

	protected finalize(): Uint8Array {
		const innerDigest =
			this.inner.digest();

		return new this.HashType()
			.update(this.outerPad)
			.update(innerDigest)
			.digest();
	}
}