import { SHA2_64 } from "../sha2/64/sha2.js";
import {
	SHA512_256_INITIAL
} from "./constants.js";

export class SHA512_256 extends SHA2_64 {
	static readonly blockSize = 128;
	static readonly digestSize = 32;

	constructor(rounds: number = 80) {
		super(
			SHA512_256_INITIAL,
			8,
			rounds,
			"SHA-512/256"
		);
	}
}