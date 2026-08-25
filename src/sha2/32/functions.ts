import {
	choose,
	majority,
	rotr32
} from "../../utils/bits.js";

export function bigSigma0(x: number): number {
	return (
		rotr32(x, 2) ^
		rotr32(x, 13) ^
		rotr32(x, 22)
	) >>> 0;
}

export function bigSigma1(x: number): number {
	return (
		rotr32(x, 6) ^
		rotr32(x, 11) ^
		rotr32(x, 25)
	) >>> 0;
}

export function smallSigma0(x: number): number {
	return (
		rotr32(x, 7) ^
		rotr32(x, 18) ^
		(x >>> 3)
	) >>> 0;
}

export function smallSigma1(x: number): number {
	return (
		rotr32(x, 17) ^
		rotr32(x, 19) ^
		(x >>> 10)
	) >>> 0;
}

export {
	choose,
	majority
};