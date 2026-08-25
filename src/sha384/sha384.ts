import { SHA2_64 } from "../sha2/64/sha2.js";
import { SHA384_INITIAL } from "./constants.js";

export class SHA384 extends SHA2_64 {
	static readonly blockSize = 128;
	static readonly digestSize = 48;

	constructor(rounds: number = 80) {
		super(
			SHA384_INITIAL,
			12,
			rounds,
			"SHA-384"
		);
	}
}