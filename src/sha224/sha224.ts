import { SHA2_32 } from "../sha2/32/sha2.js";
import { SHA224_INITIAL } from "./constants.js";

export class SHA224 extends SHA2_32 {
	static readonly blockSize = 64;
	static readonly digestSize = 28;
	
	constructor(rounds: number = 64) {
		super(
			SHA224_INITIAL,
			7, // digest words here set to `7` because `7 * 32 = 224 bits`
			rounds,
			"SHA-224"
		);
	}
}