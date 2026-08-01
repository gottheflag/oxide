import { DigestEncoding, HashInput } from "./types/hash.js";
import { bytesToHex, toBytes } from "./utils/bytes.js";

export abstract class Hash {
	private result: Uint8Array | null = null;
	
	public update(input: HashInput): this {
		if (this.result !== null) {
			throw new Error(
				"Hash already finalized."
			);
		}

		this.absorb(toBytes(input));

		return this;
	}

	public digest(): Uint8Array;

	public digest(
		encoding: "bytes"
	): Uint8Array;

	public digest(
		encoding: "hex"
	): string;

	public digest(
		encoding: DigestEncoding = "bytes"
	): Uint8Array | string {
		const result = this.getResult();

		switch (encoding) {
			case "bytes":
				return result.slice();
			case "hex":
				return bytesToHex(result);
			default:
				throw new TypeError(
					`Unsupported digest encoding: ${encoding}`
				);
		}
	}

	protected abstract absorb(
		data: Uint8Array
	): void;

	protected abstract finalize(): Uint8Array;

	protected getResult(): Uint8Array {
		if (this.result === null) {
			this.result = this
				.finalize()
				.slice();
		}

		return this.result;
	}
}