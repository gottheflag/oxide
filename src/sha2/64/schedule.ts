import {
	smallSigma0High,
	smallSigma0Low,
	smallSigma1High,
	smallSigma1Low
} from "./functions.js";

const UINT32 = 0x100000000;

export function expandSHA2_64Schedule(
	block: Uint8Array,
	offset: number,
	high: Uint32Array,
	low: Uint32Array,
	rounds: number
): void {
	for (
		let t = 0, pos = offset;
		t < 16;
		t++, pos += 8
	) {
		high[ t ] = (
			(block[ pos ] << 24) |
			(block[ pos + 1 ] << 16) |
			(block[ pos + 2 ] << 8) |
			block[ pos + 3 ]
		) >>> 0;

		low[ t ] = (
			(block[ pos + 4 ] << 24) |
			(block[ pos + 5 ] << 16) |
			(block[ pos + 6 ] << 8) |
			block[ pos + 7 ]
		) >>> 0;
	}

	for (
		let t = 16;
		t < rounds;
		t++
	) {
		const sigma1High =
			smallSigma1High(
				high[ t - 2 ],
				low[ t - 2 ]
			);

		const sigma1Low =
			smallSigma1Low(
				high[ t - 2 ],
				low[ t - 2 ]
			);

		const sigma0High =
			smallSigma0High(
				high[ t - 15 ],
				low[ t - 15 ]
			);

		const sigma0Low =
			smallSigma0Low(
				high[ t - 15 ],
				low[ t - 15 ]
			);

		const lowSum =
			sigma1Low +
			low[ t - 7 ] +
			sigma0Low +
			low[ t - 16 ];

		low[ t ] =
			lowSum >>> 0;

		high[ t ] = (
			sigma1High +
			high[ t - 7 ] +
			sigma0High +
			high[ t - 16 ] +
			Math.floor(
				lowSum / UINT32
			)
		) >>> 0;
	}
}