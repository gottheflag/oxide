import {
	rotr64High,
	rotr64Low,
	shr64High,
	shr64Low
} from "../../utils/u64.js";

/**
 * Σ0(x) =
 * ROTR^28(x) XOR
 * ROTR^34(x) XOR
 * ROTR^39(x)
 */
export function bigSigma0High(
	high: number,
	low: number
): number {
	return (
		rotr64High(high, low, 28) ^
		rotr64High(high, low, 34) ^
		rotr64High(high, low, 39)
	) >>> 0;
}

export function bigSigma0Low(
	high: number,
	low: number
): number {
	return (
		rotr64Low(high, low, 28) ^
		rotr64Low(high, low, 34) ^
		rotr64Low(high, low, 39)
	) >>> 0;
}

/**
 * Σ1(x) =
 * ROTR^14(x) XOR
 * ROTR^18(x) XOR
 * ROTR^41(x)
 */
export function bigSigma1High(
	high: number,
	low: number
): number {
	return (
		rotr64High(high, low, 14) ^
		rotr64High(high, low, 18) ^
		rotr64High(high, low, 41)
	) >>> 0;
}

export function bigSigma1Low(
	high: number,
	low: number
): number {
	return (
		rotr64Low(high, low, 14) ^
		rotr64Low(high, low, 18) ^
		rotr64Low(high, low, 41)
	) >>> 0;
}

/**
 * σ0(x) =
 * ROTR^1(x) XOR
 * ROTR^8(x) XOR
 * SHR^7(x)
 */
export function smallSigma0High(
	high: number,
	low: number
): number {
	return (
		rotr64High(high, low, 1) ^
		rotr64High(high, low, 8) ^
		shr64High(high, low, 7)
	) >>> 0;
}

export function smallSigma0Low(
	high: number,
	low: number
): number {
	return (
		rotr64Low(high, low, 1) ^
		rotr64Low(high, low, 8) ^
		shr64Low(high, low, 7)
	) >>> 0;
}

/**
 * σ1(x) =
 * ROTR^19(x) XOR
 * ROTR^61(x) XOR
 * SHR^6(x)
 */
export function smallSigma1High(
	high: number,
	low: number
): number {
	return (
		rotr64High(high, low, 19) ^
		rotr64High(high, low, 61) ^
		shr64High(high, low, 6)
	) >>> 0;
}

export function smallSigma1Low(
	high: number,
	low: number
): number {
	return (
		rotr64Low(high, low, 19) ^
		rotr64Low(high, low, 61) ^
		shr64Low(high, low, 6)
	) >>> 0;
}