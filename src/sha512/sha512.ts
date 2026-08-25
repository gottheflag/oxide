import { SHA2_64 } from "../sha2/64/sha2.js";
import { SHA512_INITIAL } from "./constants.js";

export class SHA512 extends SHA2_64 {
	static readonly blockSize = 128;
	static readonly digestSize = 64;

	constructor(rounds: number = 80) {
		super(
			SHA512_INITIAL,
			16,
			rounds,
			"SHA-512"
		);
	}
}