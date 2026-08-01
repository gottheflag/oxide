import { Hash } from "../hash.js";
import {
	choose,
	majority,
	parity,
	rotl32
} from "../utils/bits.js";
import {
	writeUint32BE,
	writeUint64BE
} from "../utils/bytes.js";

/**
 * @see {@link https://www.rfc-editor.org/info/rfc3174/#section-6.1 | RFC3174 Method 1}
 * @see {@link https://en.wikipedia.org/wiki/SHA-1#SHA-1_pseudocode | Wikipedia: SHA-1 Pseudocode}
 */
export class SHA1 extends Hash {
	private h0: number = 0x67452301;
	private h1: number = 0xEFCDAB89;
	private h2: number = 0x98BADCFE;
	private h3: number = 0x10325476;
	private h4: number = 0xC3D2E1F0;

	private length: bigint = 0n;
	private buffer: Uint8Array = new Uint8Array(64);
	private bufferLength: number = 0;

	private readonly schedule: Uint32Array;

	private rounds: number = 80;

	/**
	 * 
	 * @param rounds loops (default=80)
	 */
	constructor(rounds: number = 80) {
		super();

		if (!Number.isInteger(rounds)) {
			throw new TypeError(
				"SHA-1 rounds must be an integer."
			);
		}

		if (rounds < 1 || rounds > 80) {
			throw new RangeError(
				"SHA-1 rounds must be between 1 and 80."
			);
		}

		this.rounds = rounds;
		this.schedule = new Uint32Array(
			Math.max(16, this.rounds)
		);
	}

	protected absorb(data: Uint8Array): void {
		this.length += BigInt(data.length);

		this.write(data);
	}

	protected finalize(): Uint8Array {
		const bitLength = BigInt.asUintN(
			64,
			this.length * 8n
		);

		// M[0] = 0x80
		this.buffer[ this.bufferLength++ ] = 0x80;

		if (this.bufferLength > 56) {
			this.buffer.fill(
				0,
				this.bufferLength
			);

			this.processBlock(this.buffer);
			this.bufferLength = 0;
		}

		this.buffer.fill(
			0,
			this.bufferLength,
			56
		);

		writeUint64BE(
			this.buffer,
			56,
			bitLength
		);

		this.processBlock(this.buffer);
		this.bufferLength = 0;

		const output = new Uint8Array(20);

		writeUint32BE(output, 0, this.h0);
		writeUint32BE(output, 4, this.h1);
		writeUint32BE(output, 8, this.h2);
		writeUint32BE(output, 12, this.h3);
		writeUint32BE(output, 16, this.h4);

		return output;
	}

	private write(data: Uint8Array): void {
		let offset = 0;

		if (this.bufferLength > 0) {
			const available = 64 - this.bufferLength;
			const length = Math.min(
				available,
				data.length
			);

			this.buffer.set(
				data.subarray(0, length),
				this.bufferLength
			);

			this.bufferLength += length;
			offset += length;

			if (this.bufferLength === 64) {
				this.processBlock(this.buffer);
				this.bufferLength = 0;
			}
		}

		while (offset + 64 <= data.length) {
			this.processBlock(data, offset);
			offset += 64;
		}

		if (offset < data.length) {
			this.buffer.set(
				data.subarray(offset),
				0
			);

			this.bufferLength = data.length - offset;
		}
	}

	private processBlock(
		block: Uint8Array,
		offset: number = 0
	): void {
		/**
		 * @example
		 * ```c
		 * uint32_t W[80]; // Word sequence
		 * ```
		*/
		const W = this.schedule;

		/**
		 * 
		 * @example
		 * ```c
		 * for (t = 0; t < 16; t++)
		 *     W[t] = context->Message_Block[t * 4] << 24;
		 *     W[t] |= context->Message_Block[t * 4 + 1] << 16;
		 *     W[t] |= context->Message_Block[t * 4 + 2] << 8;
		 *     W[t] |= context->Message_Block[t * 4 + 3];
		 * }
		 * ```
		 */
		for (
			let t = 0, pos = offset;
			t < 16;
			t++, pos += 4
		) {
			W[ t ] = (
				(block[ pos ] << 24) |
				(block[ pos + 1 ] << 16) |
				(block[ pos + 2 ] << 8) |
				block[ pos + 3 ]
			) >>> 0;
		}

		/**
		 * @example
		 * ```c
		 * for(t = 16; t < 80; t++)
		 *     W[t] = SHA1CircularShift(W[t-3] ^ W[t-8] ^ W[t-14] ^ W[t-16], 1);
		 * }
		 * ```
		 */
		for (let t = 16; t < this.rounds; t++) {
			const x =
				W[ t - 3 ] ^
				W[ t - 8 ] ^
				W[ t - 14 ] ^
				W[ t - 16 ];

			W[ t ] = rotl32(x, 1);
		}

		let a = this.h0;
		let b = this.h1;
		let c = this.h2;
		let d = this.h3;
		let e = this.h4;

		for (let t = 0; t < this.rounds; t++) {
			let f: number = 0;
			let k: number = 0;

			if (t < 20) {
				f = choose(b, c, d);
				k = 0x5a827999;
			} else if (t < 40) {
				f = parity(b, c, d);
				k = 0x6ed9eba1;
			} else if (t < 60) {
				f = majority(b, c, d);
				k = 0x8f1bbcdc;
			} else {
				f = parity(b, c, d);
				k = 0xca62c1d6;
			}

			/**
			 * ```
			 * TEMP = SHA1CircularShift(A, 5) + f(t;B,C,D) + E + W(t) + K(t);
			 * ```
			 */
			const temp = (
				rotl32(a, 5) +
				f +
				e +
				W[ t ] +
				k
			) >>> 0;

			/**
			 * ```
			 * E = D;
			 * D = C;
			 * C = SHA1CircularShift(B, 30);
			 * B = A;
			 * A = TEMP;
			 * ```
			 */
			e = d;
			d = c;
			c = rotl32(b, 30);
			b = a;
			a = temp;
		}

		/** H0 = H0 + A */
		this.h0 = (this.h0 + a) >>> 0;
		/** H1 = H1 + B */
		this.h1 = (this.h1 + b) >>> 0;
		/** H2 = H2 + C */
		this.h2 = (this.h2 + c) >>> 0;
		/** H3 = H3 + D */
		this.h3 = (this.h3 + d) >>> 0;
		/** H4 = H4 + E */
		this.h4 = (this.h4 + e) >>> 0;
	}
}