import { Hash } from "../../hash.js";
import {
	choose,
	majority
} from "../../utils/bits.js";
import { writeUint32BE } from "../../utils/bytes.js";

import { SHA2_64_K } from "./constants.js";
import {
	bigSigma0High,
	bigSigma0Low,
	bigSigma1High,
	bigSigma1Low
} from "./functions.js";
import {
	expandSHA2_64Schedule
} from "./schedule.js";

const BLOCK_SIZE = 128;
const LENGTH_OFFSET = 112;
const UINT32 = 0x100000000;

export abstract class SHA2_64 extends Hash {
	private h0High: number;
	private h0Low: number;
	private h1High: number;
	private h1Low: number;
	private h2High: number;
	private h2Low: number;
	private h3High: number;
	private h3Low: number;
	private h4High: number;
	private h4Low: number;
	private h5High: number;
	private h5Low: number;
	private h6High: number;
	private h6Low: number;
	private h7High: number;
	private h7Low: number;

	private bitLength0: number = 0;
	private bitLength1: number = 0;
	private bitLength2: number = 0;
	private bitLength3: number = 0;

	private readonly buffer =
		new Uint8Array(BLOCK_SIZE);

	private bufferLength: number = 0;

	private readonly scheduleHigh: Uint32Array;
	private readonly scheduleLow: Uint32Array;

	private readonly rounds: number;
	private readonly digestWords32: number;

	protected constructor(
		initial: Uint32Array,
		digestWords32: number,
		rounds: number,
		name: string
	) {
		super();

		if (initial.length !== 16) {
			throw new RangeError(
				"SHA-2/64 initial state must contain 8 64-bit words."
			);
		}

		if (!Number.isInteger(rounds)) {
			throw new TypeError(
				`${name} rounds must be an integer.`
			);
		}

		if (rounds < 1 || rounds > 80) {
			throw new RangeError(
				`${name} rounds must be between 1 and 80.`
			);
		}

		this.h0High = initial[ 0 ];
		this.h0Low = initial[ 1 ];
		this.h1High = initial[ 2 ];
		this.h1Low = initial[ 3 ];
		this.h2High = initial[ 4 ];
		this.h2Low = initial[ 5 ];
		this.h3High = initial[ 6 ];
		this.h3Low = initial[ 7 ];
		this.h4High = initial[ 8 ];
		this.h4Low = initial[ 9 ];
		this.h5High = initial[ 10 ];
		this.h5Low = initial[ 11 ];
		this.h6High = initial[ 12 ];
		this.h6Low = initial[ 13 ];
		this.h7High = initial[ 14 ];
		this.h7Low = initial[ 15 ];

		if (
			!Number.isInteger(digestWords32) ||
			digestWords32 < 1 ||
			digestWords32 > 16
		) {
			throw new RangeError(
				"SHA-2/64 digest must contain between 1 and 16 32-bit words."
			);
		}

		this.digestWords32 = digestWords32;
		this.rounds = rounds;

		const scheduleLength =
			Math.max(16, rounds);

		this.scheduleHigh =
			new Uint32Array(scheduleLength);

		this.scheduleLow =
			new Uint32Array(scheduleLength);
	}

	protected absorb(data: Uint8Array): void {
		this.addLength(data.length);
		this.write(data);
	}

	protected finalize(): Uint8Array {
		this.buffer[ this.bufferLength++ ] = 0x80;

		if (this.bufferLength > LENGTH_OFFSET) {
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
			LENGTH_OFFSET
		);

		writeUint32BE(
			this.buffer,
			112,
			this.bitLength0
		);

		writeUint32BE(
			this.buffer,
			116,
			this.bitLength1
		);

		writeUint32BE(
			this.buffer,
			120,
			this.bitLength2
		);

		writeUint32BE(
			this.buffer,
			124,
			this.bitLength3
		);

		this.processBlock(this.buffer);
		this.bufferLength = 0;

		return this.serializeDigest();
	}

	protected processBlock(
		block: Uint8Array,
		offset: number = 0
	): void {
		const WHigh = this.scheduleHigh;
		const WLow = this.scheduleLow;

		expandSHA2_64Schedule(
			block,
			offset,
			WHigh,
			WLow,
			this.rounds
		);

		let aHigh = this.h0High;
		let aLow = this.h0Low;
		let bHigh = this.h1High;
		let bLow = this.h1Low;
		let cHigh = this.h2High;
		let cLow = this.h2Low;
		let dHigh = this.h3High;
		let dLow = this.h3Low;
		let eHigh = this.h4High;
		let eLow = this.h4Low;
		let fHigh = this.h5High;
		let fLow = this.h5Low;
		let gHigh = this.h6High;
		let gLow = this.h6Low;
		let hHigh = this.h7High;
		let hLow = this.h7Low;

		for (
			let t = 0;
			t < this.rounds;
			t++
		) {
			const sigma1High =
				bigSigma1High(
					eHigh,
					eLow
				);

			const sigma1Low =
				bigSigma1Low(
					eHigh,
					eLow
				);

			const chooseHigh =
				choose(
					eHigh,
					fHigh,
					gHigh
				);

			const chooseLow =
				choose(
					eLow,
					fLow,
					gLow
				);

			const constantOffset =
				t * 2;

			let lowSum =
				hLow +
				sigma1Low +
				chooseLow +
				SHA2_64_K[
				constantOffset + 1
				] +
				WLow[ t ];

			const temp1Low =
				lowSum >>> 0;

			const temp1High = (
				hHigh +
				sigma1High +
				chooseHigh +
				SHA2_64_K[
				constantOffset
				] +
				WHigh[ t ] +
				Math.floor(
					lowSum / UINT32
				)
			) >>> 0;

			const sigma0High =
				bigSigma0High(
					aHigh,
					aLow
				);

			const sigma0Low =
				bigSigma0Low(
					aHigh,
					aLow
				);

			const majorityHigh =
				majority(
					aHigh,
					bHigh,
					cHigh
				);

			const majorityLow =
				majority(
					aLow,
					bLow,
					cLow
				);

			lowSum =
				sigma0Low +
				majorityLow;

			const temp2Low =
				lowSum >>> 0;

			const temp2High = (
				sigma0High +
				majorityHigh +
				Math.floor(
					lowSum / UINT32
				)
			) >>> 0;

			lowSum =
				dLow +
				temp1Low;

			const nextELow =
				lowSum >>> 0;

			const nextEHigh = (
				dHigh +
				temp1High +
				Math.floor(
					lowSum / UINT32
				)
			) >>> 0;

			lowSum =
				temp1Low +
				temp2Low;

			const nextALow =
				lowSum >>> 0;

			const nextAHigh = (
				temp1High +
				temp2High +
				Math.floor(
					lowSum / UINT32
				)
			) >>> 0;

			hHigh = gHigh;
			hLow = gLow;

			gHigh = fHigh;
			gLow = fLow;

			fHigh = eHigh;
			fLow = eLow;

			eHigh = nextEHigh;
			eLow = nextELow;

			dHigh = cHigh;
			dLow = cLow;

			cHigh = bHigh;
			cLow = bLow;

			bHigh = aHigh;
			bLow = aLow;

			aHigh = nextAHigh;
			aLow = nextALow;
		}

		let sum =
			this.h0Low + aLow;

		this.h0Low = sum >>> 0;
		this.h0High = (
			this.h0High +
			aHigh +
			Math.floor(sum / UINT32)
		) >>> 0;

		sum =
			this.h1Low + bLow;

		this.h1Low = sum >>> 0;
		this.h1High = (
			this.h1High +
			bHigh +
			Math.floor(sum / UINT32)
		) >>> 0;

		sum =
			this.h2Low + cLow;

		this.h2Low = sum >>> 0;
		this.h2High = (
			this.h2High +
			cHigh +
			Math.floor(sum / UINT32)
		) >>> 0;

		sum =
			this.h3Low + dLow;

		this.h3Low = sum >>> 0;
		this.h3High = (
			this.h3High +
			dHigh +
			Math.floor(sum / UINT32)
		) >>> 0;

		sum =
			this.h4Low + eLow;

		this.h4Low = sum >>> 0;
		this.h4High = (
			this.h4High +
			eHigh +
			Math.floor(sum / UINT32)
		) >>> 0;

		sum =
			this.h5Low + fLow;

		this.h5Low = sum >>> 0;
		this.h5High = (
			this.h5High +
			fHigh +
			Math.floor(sum / UINT32)
		) >>> 0;

		sum =
			this.h6Low + gLow;

		this.h6Low = sum >>> 0;
		this.h6High = (
			this.h6High +
			gHigh +
			Math.floor(sum / UINT32)
		) >>> 0;

		sum =
			this.h7Low + hLow;

		this.h7Low = sum >>> 0;
		this.h7High = (
			this.h7High +
			hHigh +
			Math.floor(sum / UINT32)
		) >>> 0;
	}

	protected serializeDigest(): Uint8Array {
		const output =
			new Uint8Array(
				this.digestWords32 * 4
			);

		for (
			let index = 0;
			index < this.digestWords32;
			index++
		) {
			writeUint32BE(
				output,
				index * 4,
				this.digestWord(index)
			);
		}

		return output;
	}

	private digestWord(
		index: number
	): number {
		switch (index) {
			case 0:
				return this.h0High;
			case 1:
				return this.h0Low;
			case 2:
				return this.h1High;
			case 3:
				return this.h1Low;
			case 4:
				return this.h2High;
			case 5:
				return this.h2Low;
			case 6:
				return this.h3High;
			case 7:
				return this.h3Low;
			case 8:
				return this.h4High;
			case 9:
				return this.h4Low;
			case 10:
				return this.h5High;
			case 11:
				return this.h5Low;
			case 12:
				return this.h6High;
			case 13:
				return this.h6Low;
			case 14:
				return this.h7High;
			case 15:
				return this.h7Low;
			default:
				throw new RangeError(
					`Invalid SHA-2/64 digest word: ${index}`
				);
		}
	}

	private addLength(byteLength: number): void {
		const addedLow =
			(byteLength << 3) >>> 0;

		const addedHigh =
			Math.floor(
				byteLength /
				0x20000000
			) >>> 0;

		let sum =
			this.bitLength3 +
			addedLow;

		this.bitLength3 =
			sum >>> 0;

		let carry =
			Math.floor(sum / UINT32);

		sum =
			this.bitLength2 +
			addedHigh +
			carry;

		this.bitLength2 =
			sum >>> 0;

		carry =
			Math.floor(sum / UINT32);

		sum =
			this.bitLength1 +
			carry;

		this.bitLength1 =
			sum >>> 0;

		carry =
			Math.floor(sum / UINT32);

		this.bitLength0 = (
			this.bitLength0 +
			carry
		) >>> 0;
	}

	private write(data: Uint8Array): void {
		let offset = 0;

		if (this.bufferLength > 0) {
			const available =
				BLOCK_SIZE -
				this.bufferLength;

			const length = Math.min(
				available,
				data.length
			);

			this.buffer.set(
				data.subarray(
					0,
					length
				),
				this.bufferLength
			);

			this.bufferLength += length;
			offset += length;

			if (
				this.bufferLength ===
				BLOCK_SIZE
			) {
				this.processBlock(
					this.buffer
				);

				this.bufferLength = 0;
			}
		}

		while (
			offset + BLOCK_SIZE <=
			data.length
		) {
			this.processBlock(
				data,
				offset
			);

			offset += BLOCK_SIZE;
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
}