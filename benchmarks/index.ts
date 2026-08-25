import {
	createHash,
	createHmac
} from "node:crypto";

import {
	performance
} from "node:perf_hooks";

import {
	Hash
} from "../src/hash.js";

import {
	HMAC
} from "../src/hmac/index.js";

import {
	SHA1
} from "../src/sha1/index.js";

import {
	SHA256
} from "../src/sha256/index.js";

import {
	SHA512
} from "../src/sha512/index.js";

interface Benchmark {
	name: string;
	bytes: number;
	iterations: number;
	warmup?: number;
	run: () => void;
}

interface Size {
	bytes: number;
	iterations: number;
}

interface HashSuite {
	name: string;
	oxide: () => Hash;
	node: string;
}

const sizes: Size[] = [
	{
		bytes: 8,
		iterations: 100_000
	},
	{
		bytes: 32,
		iterations: 100_000
	},
	{
		bytes: 1_024,
		iterations: 20_000
	}
];

const hashSuites: HashSuite[] = [
	{
		name: "SHA-1",
		oxide: () => new SHA1(),
		node: "sha1"
	},
	{
		name: "SHA-256",
		oxide: () => new SHA256(),
		node: "sha256"
	},
	{
		name: "SHA-512",
		oxide: () => new SHA512(),
		node: "sha512"
	}
];

const hmacKey =
	new TextEncoder()
		.encode(
			"oxide-benchmark-key"
		);

function median(
	values: number[]
): number {
	const sorted =
		[ ...values ].sort(
			(a, b) => a - b
		);

	return sorted[
		Math.floor(
			sorted.length / 2
		)
	];
}

function measure({
	name,
	bytes,
	iterations,
	warmup = 1_000,
	run
}: Benchmark): void {
	for (
		let iteration = 0;
		iteration < warmup;
		iteration++
	) {
		run();
	}

	const samples: number[] = [];

	for (
		let sample = 0;
		sample < 7;
		sample++
	) {
		const startedAt =
			performance.now();

		for (
			let iteration = 0;
			iteration < iterations;
			iteration++
		) {
			run();
		}

		samples.push(
			performance.now() -
			startedAt
		);
	}

	const duration =
		median(samples);

	const seconds =
		duration / 1_000;

	const operationsPerSecond =
		iterations / seconds;

	const throughput =
		(bytes * iterations) /
		(1024 * 1024) /
		seconds;

	console.log(
		`${name.padEnd(28)} ` +
		`${operationsPerSecond
			.toFixed(0)
			.padStart(10)} ops/s  ` +
		`${throughput
			.toFixed(2)
			.padStart(9)} MiB/s`
	);
}

function createInput(
	size: number
): Uint8Array {
	const input =
		new Uint8Array(size);

	for (
		let index = 0;
		index < input.length;
		index++
	) {
		input[ index ] =
			(index * 31 + 17) &
			0xff;
	}

	return input;
}

function benchmarkHash(
	suite: HashSuite,
	size: Size
): void {
	const input =
		createInput(size.bytes);

	console.log(
		`\n${suite.name} — ${size.bytes} bytes`
	);

	measure({
		name: "Oxide",
		bytes: size.bytes,
		iterations:
			size.iterations,

		run(): void {
			suite
				.oxide()
				.update(input)
				.digest();
		}
	});

	measure({
		name: "Node",
		bytes: size.bytes,
		iterations:
			size.iterations,

		run(): void {
			createHash(
				suite.node
			)
				.update(input)
				.digest();
		}
	});

	if (size.bytes !== 1_024) {
		return;
	}

	const chunks =
		Array.from(
			{
				length:
					input.length
			},
			(_, index) =>
				input.subarray(
					index,
					index + 1
				)
		);

	measure({
		name: "Oxide 1-byte chunks",
		bytes: size.bytes,
		iterations: 2_000,
		warmup: 100,

		run(): void {
			const hash =
				suite.oxide();

			for (
				const chunk of chunks
			) {
				hash.update(chunk);
			}

			hash.digest();
		}
	});

	measure({
		name: "Node 1-byte chunks",
		bytes: size.bytes,
		iterations: 2_000,
		warmup: 100,

		run(): void {
			const hash =
				createHash(
					suite.node
				);

			for (
				const chunk of chunks
			) {
				hash.update(chunk);
			}

			hash.digest();
		}
	});
}

function benchmarkHMAC(
	size: Size
): void {
	const input =
		createInput(size.bytes);

	console.log(
		`\nHMAC-SHA-256 — ${size.bytes} bytes`
	);

	measure({
		name: "Oxide",
		bytes: size.bytes,
		iterations:
			size.iterations,

		run(): void {
			HMAC
				.sha256(hmacKey)
				.update(input)
				.digest();
		}
	});

	measure({
		name: "Node",
		bytes: size.bytes,
		iterations:
			size.iterations,

		run(): void {
			createHmac(
				"sha256",
				hmacKey
			)
				.update(input)
				.digest();
		}
	});

	if (size.bytes !== 1_024) {
		return;
	}

	const chunks =
		Array.from(
			{
				length:
					input.length
			},
			(_, index) =>
				input.subarray(
					index,
					index + 1
				)
		);

	measure({
		name: "Oxide 1-byte chunks",
		bytes: size.bytes,
		iterations: 2_000,
		warmup: 100,

		run(): void {
			const hmac =
				HMAC.sha256(
					hmacKey
				);

			for (
				const chunk of chunks
			) {
				hmac.update(chunk);
			}

			hmac.digest();
		}
	});

	measure({
		name: "Node 1-byte chunks",
		bytes: size.bytes,
		iterations: 2_000,
		warmup: 100,

		run(): void {
			const hmac =
				createHmac(
					"sha256",
					hmacKey
				);

			for (
				const chunk of chunks
			) {
				hmac.update(chunk);
			}

			hmac.digest();
		}
	});
}

for (const suite of hashSuites) {
	for (const size of sizes) {
		benchmarkHash(
			suite,
			size
		);
	}
}

for (const size of sizes) {
	benchmarkHMAC(size);
}