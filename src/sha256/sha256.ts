import { SHA2_32 } from "../sha2/32/sha2.js";
import { SHA256_INITIAL } from "./constants.js";

export class SHA256 extends SHA2_32 {
	static readonly blockSize = 64;
	static readonly digestSize = 32;

	constructor(rounds: number = 64) {
		super(
			SHA256_INITIAL,
			8,
			rounds,
			"SHA-256"
		);
	}
}