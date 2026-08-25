/**
 * t     Current round
 * S^n     Left rotation by <n> bits (SHA1CircularShift(word, n))
 * 
 * ---
 * 
 * @see {@link https://www.rfc-editor.org/info/rfc3174/#section-5 | Functions and Constants Used}
 * 
 * 
 * f(t;B,C,D) = (B AND C) OR ((NOT B) AND D)         ( 0 <= t <= 19)
 * 
 * f(t;B,C,D) = B XOR C XOR D                        (20 <= t <= 39)
 * 
 * f(t;B,C,D) = (B AND C) OR (B AND D) OR (C AND D)  (40 <= t <= 59)
 * 
 * f(t;B,C,D) = B XOR C XOR D                        (60 <= t <= 79)
 * 
 * ---
 * 
 * K(t) = 5A827999         ( 0 <= t <= 19)
 * 
 * K(t) = 6ED9EBA1         (20 <= t <= 39)
 * 
 * K(t) = 8F1BBCDC         (40 <= t <= 59)
 * 
 * K(t) = CA62C1D6         (60 <= t <= 79)
*/

/**
 * 32-bit left rotation.
 * 
 * @example
 * ```c
 * // Define the SHA1 circular left shift macro
 * #define SHA1CircularShift(word, bits) \
 *              (((word) << (bits)) | ((word) >> (32-(bits))))
 * ```
 * 
 * @param word 
 * @param bits 
 * @returns 
 */
export function rotl32(word: number, bits: number): number {
	/**
	 * ensure we are using 32bit ints (1-31, for sha1).
	 */
	bits &= 31;
	word >>>= 0;

	return (
		(word << bits) |
		(word >>> (32 - bits))
	) >>> 0;
}

/**
 * 32-bit right rotation.
 * 
 * 
 * @param word 
 * @param bits 
 */
export function rotr32(
	word: number,
	bits: number
): number {
	bits &= 31;
	word >>>= 0;

	return (
		(word >>> bits) |
		(word << (32 - bits))
	) >>> 0;
}

/**
 * Ch function (0 <= t <= 19)
 * 
 * ```
 * f(t;B,C,D) = (B AND C) OR ((NOT B) AND D)
 * ```
 * 
 * @example
 * ```c
 * ((B & C) | ((~B) & D))
 * ```
 */
export function choose(
	b: number,
	c: number,
	d: number
): number {
	return (
		(b & c) |
		((~b >>> 0) & d)
	) >>> 0;
}

/**
 * @description 
 * 
 * ```
 * B XOR C XOR D
 * ```
 * 
 * @example
 * ```c
 * B ^ C ^ D
 * ```
 * 
 */
export function parity(
	b: number,
	c: number,
	d: number
): number {
	return (b ^ c ^ d) >>> 0;
}

/**
 * Maj function
 * 
 * @example
 * ```c
 * ((B & C) | (B & D) | (C & D))
 * ```
 */
export function majority(
	b: number,
	c: number,
	d: number
): number {
	return (
		(b & c) |
		(b & d) |
		(c & d)
	) >>> 0;
}