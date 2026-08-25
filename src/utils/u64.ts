export function rotr64High(
	high: number,
	low: number,
	bits: number
): number {
	bits &= 63;

	high >>>= 0;
	low >>>= 0;

	if (bits === 0) {
		return high;
	}

	if (bits < 32) {
		return (
			(high >>> bits) |
			(low << (32 - bits))
		) >>> 0;
	}

	if (bits === 32) {
		return low;
	}

	bits -= 32;

	return (
		(low >>> bits) |
		(high << (32 - bits))
	) >>> 0;
}

export function rotr64Low(
	high: number,
	low: number,
	bits: number
): number {
	bits &= 63;

	high >>>= 0;
	low >>>= 0;

	if (bits === 0) {
		return low;
	}

	if (bits < 32) {
		return (
			(low >>> bits) |
			(high << (32 - bits))
		) >>> 0;
	}

	if (bits === 32) {
		return high;
	}

	bits -= 32;

	return (
		(high >>> bits) |
		(low << (32 - bits))
	) >>> 0;
}

export function shr64High(
	high: number,
	_low: number,
	bits: number
): number {
	if (bits <= 0) {
		return high >>> 0;
	}

	if (bits < 32) {
		return high >>> bits;
	}

	return 0;
}

export function shr64Low(
	high: number,
	low: number,
	bits: number
): number {
	high >>>= 0;
	low >>>= 0;

	if (bits <= 0) {
		return low;
	}

	if (bits < 32) {
		return (
			(low >>> bits) |
			(high << (32 - bits))
		) >>> 0;
	}

	if (bits === 32) {
		return high;
	}

	if (bits < 64) {
		return high >>> (bits - 32);
	}

	return 0;
}