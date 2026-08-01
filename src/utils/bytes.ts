import { HashInput } from "../types/hash.js";

const textEncoder = new TextEncoder();

export function toBytes(
	input: HashInput,
): Uint8Array {
	if (typeof input === "string") {
		return textEncoder.encode(input);
	}

	if (input instanceof Uint8Array) {
		return input;
	}
	
	if (ArrayBuffer.isView(input)) {
		return new Uint8Array(
			input.buffer,
			input.byteOffset,
			input.byteLength
		);
	}

	if (input instanceof ArrayBuffer) {
		return new Uint8Array(input);
	}

	throw new TypeError(
		"Hash input must be a string, ArrayBuffer, or ArrayBuffer view."
	);
}

export function bytesToHex(
	bytes: Uint8Array,
): string {
	let out = '';

	for (const b of bytes) {
		out += b
			.toString(16)
			.padStart(2, '0');
	}

	return out;
}

export function readUint32BE(
	buffer: Uint8Array,
	offset: number
): number {
	return (
		( (buffer[offset]     * 0x1000000) >>> 0 ) |
		( (buffer[offset + 1] * 0x10000)   >>> 0 ) |
		( (buffer[offset + 2] * 0x100)     >>> 0 ) |
		( buffer[offset + 3]                     )
	) >>> 0 /* < JS tweak (output must be unsigned 32bit) */;
}

export function writeUint32BE(
	buffer: Uint8Array,
	offset: number,
	value: number
): void {
	buffer[offset] = value >>> 24;
	buffer[offset + 1] = value >>> 16;
	buffer[offset + 2] = value >>> 8;
	buffer[offset + 3] = value;
}

export function writeUint64BE(
	buffer: Uint8Array,
	offset: number,
	value: bigint
): void {
	writeUint32BE(
		buffer,
		offset,
		Number((value >> 32n) & 0xffffffffn)
	);

	writeUint32BE(
		buffer,
		offset + 4,
		Number(value & 0xffffffffn)
	);
}