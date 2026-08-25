import { SHA2_64 } from "../sha2/64/sha2.js";
import {
	SHA512_224_INITIAL
} from "./constants.js";

export class SHA512_224 extends SHA2_64 {
	static readonly blockSize = 128;
	static readonly digestSize = 28;

	constructor(rounds: number = 80) {
		super(
			SHA512_224_INITIAL,
			7,
			rounds,
			"SHA-512/224"
		);
	}
}