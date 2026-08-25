import { Hash } from "../../hash.js";
import { writeUint32BE } from "../../utils/bytes.js";

import { SHA2_32_K } from "./constants.js";
import {
	bigSigma0,
	bigSigma1,
	choose,
	majority,
	smallSigma0,
	smallSigma1
} from "./functions.js";

export abstract class SHA2_32 extends Hash {
	private h0: number;
	private h1: number;
	private h2: number;
	private h3: number;
	private h4: number;
	private h5: number;
	private h6: number;
	private h7: number;

	private bitLengthLow: number = 0;
	private bitLengthHigh: number = 0;

	private buffer: Uint8Array = new Uint8Array(64);
	private bufferLength: number = 0;

	private readonly schedule: Uint32Array;
	private readonly rounds: number;
	private readonly digestWords: number;

	protected constructor(
		initial: Uint32Array,
		digestWords: number,
		rounds: number,
		name: string
	) {
		super();

		if (!Number.isInteger(rounds)) {
			throw new TypeError(
				`${name} rounds must be an integer.`
			);
		}

		if (rounds < 1 || rounds > 64) {
			throw new RangeError(
				`${name} rounds must be between 1 and 64.`
			);
		}

		this.h0 = initial[ 0 ];
		this.h1 = initial[ 1 ];
		this.h2 = initial[ 2 ];
		this.h3 = initial[ 3 ];
		this.h4 = initial[ 4 ];
		this.h5 = initial[ 5 ];
		this.h6 = initial[ 6 ];
		this.h7 = initial[ 7 ];

		this.digestWords = digestWords;
		this.rounds = rounds;

		this.schedule = new Uint32Array(
			Math.max(16, rounds)
		);
	}

	protected absorb(data: Uint8Array): void {
		const previousLow = this.bitLengthLow;

		const addedLow =
			(data.length << 3) >>> 0;

		const addedHigh =
			data.length >>> 29;

		this.bitLengthLow = (
			previousLow + addedLow
		) >>> 0;

		const carry =
			this.bitLengthLow < previousLow
				? 1
				: 0;

		this.bitLengthHigh = (
			this.bitLengthHigh +
			addedHigh +
			carry
		) >>> 0;

		this.write(data);
	}

	protected finalize(): Uint8Array {
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

		writeUint32BE(
			this.buffer,
			56,
			this.bitLengthHigh
		);

		writeUint32BE(
			this.buffer,
			60,
			this.bitLengthLow
		);

		this.processBlock(this.buffer);
		this.bufferLength = 0;

		const output = new Uint8Array(
			this.digestWords * 4
		);

		writeUint32BE(output, 0, this.h0);
		writeUint32BE(output, 4, this.h1);
		writeUint32BE(output, 8, this.h2);
		writeUint32BE(output, 12, this.h3);
		writeUint32BE(output, 16, this.h4);
		writeUint32BE(output, 20, this.h5);
		writeUint32BE(output, 24, this.h6);

		if (this.digestWords === 8) {
			writeUint32BE(
				output,
				28,
				this.h7
			);
		}

		return output;
	}

	private write(data: Uint8Array): void {
		let offset = 0;

		if (this.bufferLength > 0) {
			const available =
				64 - this.bufferLength;

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
			this.processBlock(
				data,
				offset
			);

			offset += 64;
		}

		if (offset < data.length) {
			this.buffer.set(
				data.subarray(offset),
				0
			);

			this.bufferLength =
				data.length - offset;
		}
	}

	private processBlock(
		block: Uint8Array,
		offset: number = 0
	): void {
		const W = this.schedule;

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

		for (
			let t = 16;
			t < this.rounds;
			t++
		) {
			W[ t ] = (
				smallSigma1(W[ t - 2 ]) +
				W[ t - 7 ] +
				smallSigma0(W[ t - 15 ]) +
				W[ t - 16 ]
			) >>> 0;
		}

		let a = this.h0;
		let b = this.h1;
		let c = this.h2;
		let d = this.h3;
		let e = this.h4;
		let f = this.h5;
		let g = this.h6;
		let h = this.h7;

		for (
			let t = 0;
			t < this.rounds;
			t++
		) {
			const temp1 = (
				h +
				bigSigma1(e) +
				choose(e, f, g) +
				SHA2_32_K[ t ] +
				W[ t ]
			) >>> 0;

			const temp2 = (
				bigSigma0(a) +
				majority(a, b, c)
			) >>> 0;

			h = g;
			g = f;
			f = e;
			e = (d + temp1) >>> 0;
			d = c;
			c = b;
			b = a;
			a = (temp1 + temp2) >>> 0;
		}

		this.h0 = (this.h0 + a) >>> 0;
		this.h1 = (this.h1 + b) >>> 0;
		this.h2 = (this.h2 + c) >>> 0;
		this.h3 = (this.h3 + d) >>> 0;
		this.h4 = (this.h4 + e) >>> 0;
		this.h5 = (this.h5 + f) >>> 0;
		this.h6 = (this.h6 + g) >>> 0;
		this.h7 = (this.h7 + h) >>> 0;
	}
}