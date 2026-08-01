import { createHash } from "node:crypto";
import { performance } from "node:perf_hooks";

import { SHA1 } from "../src/sha1/index.js";

interface Benchmark {
	name: string;
	bytes: number;
	iterations: number;
	warmup?: number;
	run: () => void;
}

function median(values: number[]): number {
	const sorted = [...values].sort(
		(a, b) => a - b
	);

	return sorted[
		Math.floor(sorted.length / 2)
	];
}

function measure({
	name,
	bytes,
	iterations,
	warmup = 1_000,
	run,
}: Benchmark): void {
	for (
		let iteration = 0;
		iteration < warmup;
		iteration++
	) {
		run();
	}

	const samples: number[] = [];

	for (let sample = 0; sample < 7; sample++) {
		const startedAt = performance.now();

		for (
			let iteration = 0;
			iteration < iterations;
			iteration++
		) {
			run();
		}

		samples.push(
			performance.now() - startedAt
		);
	}

	const duration = median(samples);

	const seconds = duration / 1_000;

	const operationsPerSecond =
		iterations / seconds;

	const throughput =
		(bytes * iterations) /
		(1024 * 1024) /
		seconds;

	console.log(
		`${name.padEnd(26)} ` +
		`${operationsPerSecond
			.toFixed(0)
			.padStart(10)} ops/s  ` +
		`${throughput
			.toFixed(2)
			.padStart(9)} MiB/s`
	);
}

function createInput(size: number): Uint8Array {
	const input = new Uint8Array(size);

	for (
		let index = 0;
		index < input.length;
		index++
	) {
		input[index] =
			(index * 31 + 17) & 0xff;
	}

	return input;
}

function benchmarkSize(
	size: number,
	iterations: number
): void {
	const input = createInput(size);

	console.log(`\n${size} bytes`);

	measure({
		name: "Oxide",
		bytes: size,
		iterations,

		run(): void {
			new SHA1()
				.update(input)
				.digest();
		},
	});

	measure({
		name: "Node",
		bytes: size,
		iterations,

		run(): void {
			createHash("sha1")
				.update(input)
				.digest();
		},
	});

	if (size !== 1_024) {
		return;
	}

	const chunks = Array.from(
		{ length: input.length },
		(_, index) =>
			input.subarray(
				index,
				index + 1
			)
	);

	measure({
		name: "Oxide 1-byte chunks",
		bytes: size,
		iterations: 2_000,
		warmup: 100,

		run(): void {
			const hash = new SHA1();

			for (const chunk of chunks) {
				hash.update(chunk);
			}

			hash.digest();
		},
	});

	measure({
		name: "Node 1-byte chunks",
		bytes: size,
		iterations: 2_000,
		warmup: 100,

		run(): void {
			const hash = createHash("sha1");

			for (const chunk of chunks) {
				hash.update(chunk);
			}

			hash.digest();
		},
	});
}

benchmarkSize(
	32,
	100_000
);

benchmarkSize(
	1_024,
	20_000
);

benchmarkSize(
	1024 * 1024,
	50
);