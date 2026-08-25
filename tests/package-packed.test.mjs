import assert from "node:assert/strict";
import {
	mkdtempSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	rmSync,
	writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

import { createRequire } from "node:module";

const require =
	createRequire(import.meta.url);

const tscCli =
	require.resolve(
		"typescript/bin/tsc"
	);

const root = process.cwd();

const temporary =
	mkdtempSync(
		join(tmpdir(), "oxide-packed-")
	);

const packed =
	join(temporary, "packed");

const consumer =
	join(temporary, "consumer");

mkdirSync(packed);
mkdirSync(consumer);

const pnpmCli =
	process.env.npm_execpath;

if (!pnpmCli) {
	throw new Error(
		"Unable to locate the pnpm CLI."
	);
}

let succeeded = false;

function run(
	command,
	args,
	cwd = root
) {
	const result =
		spawnSync(
			command,
			args,
			{
				cwd,
				stdio: "inherit"
			}
		);

	if (result.error) {
		throw result.error;
	}

	if (result.status !== 0) {
		throw new Error(
			`${command} ${args.join(" ")} failed with exit code ${result.status}.`
		);
	}
}

function runPnpm(
	args,
	cwd = root
) {
	run(
		process.execPath,
		[
			pnpmCli,
			...args
		],
		cwd
	);
}

try {
	//
	// Pack exactly what would be published.
	//

	runPnpm([
		"pack",
		"--pack-destination",
		packed
	]);

	const tarballs =
		readdirSync(packed)
			.filter(
				file =>
					file.endsWith(".tgz")
			);

	assert.equal(
		tarballs.length,
		1,
		"Expected exactly one packed tarball."
	);

	const tarball =
		join(
			packed,
			tarballs[0]
		);

	//
	// Create a completely separate consumer.
	//

	writeFileSync(
		join(
			consumer,
			"package.json"
		),
		JSON.stringify(
			{
				private: true,
				type: "module"
			},
			null,
			2
		)
	);

	runPnpm(
		[
			"add",
			"--ignore-scripts",
			tarball
		],
		consumer
	);

	//
	// ESM consumer.
	//

	writeFileSync(
		join(
			consumer,
			"esm.mjs"
		),
		`
import assert from "node:assert/strict";

import { Hash } from "@gottheflag/oxide";
import { HMAC } from "@gottheflag/oxide/hmac";

import { SHA1 } from "@gottheflag/oxide/sha1";
import { SHA224 } from "@gottheflag/oxide/sha224";
import { SHA256 } from "@gottheflag/oxide/sha256";
import { SHA384 } from "@gottheflag/oxide/sha384";
import { SHA512 } from "@gottheflag/oxide/sha512";
import { SHA512_224 } from "@gottheflag/oxide/sha512-224";
import { SHA512_256 } from "@gottheflag/oxide/sha512-256";

for (const value of [
	Hash,
	HMAC,
	SHA1,
	SHA224,
	SHA256,
	SHA384,
	SHA512,
	SHA512_224,
	SHA512_256
]) {
	assert.equal(typeof value, "function");
}

assert.equal(
	new SHA256()
		.update("abc")
		.digest("hex"),
	"ba7816bf8f01cfea414140de5dae2223" +
	"b00361a396177a9cb410ff61f20015ad"
);

assert.equal(
	HMAC.sha256("secret")
		.update("message")
		.digest("hex"),
	"8b5f48702995c1598c573db1e21866a9" +
	"b825d4a794d169d7060a03605796360b"
);

await assert.rejects(
	import("@gottheflag/oxide/sha2/64/sha2"),
	error =>
		error?.code ===
		"ERR_PACKAGE_PATH_NOT_EXPORTED"
);

console.log("Packed ESM consumer passed.");
`
	);

	run(
		process.execPath,
		["esm.mjs"],
		consumer
	);

	//
	// CommonJS consumer.
	//

	writeFileSync(
		join(
			consumer,
			"cjs.cjs"
		),
		`
const assert = require("node:assert/strict");

const {
	HMAC
} = require("@gottheflag/oxide/hmac");

const {
	SHA512
} = require("@gottheflag/oxide/sha512");

assert.equal(
	new SHA512()
		.update("abc")
		.digest("hex"),
	"ddaf35a193617abacc417349ae204131" +
	"12e6fa4e89a97ea20a9eeee64b55d39a" +
	"2192992a274fc1a836ba3c23a3feebbd" +
	"454d4423643ce80e2a9ac94fa54ca49f"
);

assert.equal(
	HMAC.sha256("secret")
		.update("message")
		.digest("hex"),
	"8b5f48702995c1598c573db1e21866a9" +
	"b825d4a794d169d7060a03605796360b"
);

assert.throws(
	() =>
		require(
			"@gottheflag/oxide/sha2/64/sha2"
		),
	error =>
		error?.code ===
		"ERR_PACKAGE_PATH_NOT_EXPORTED"
);

console.log("Packed CommonJS consumer passed.");
`
	);

	run(
		process.execPath,
		["cjs.cjs"],
		consumer
	);

	//
	// TypeScript consumer.
	//

	writeFileSync(
		join(
			consumer,
			"consumer.ts"
		),
		`
import {
	Hash
} from "@gottheflag/oxide";

import type {
	HashInput
} from "@gottheflag/oxide";

import {
	HMAC
} from "@gottheflag/oxide/hmac";

import {
	SHA256
} from "@gottheflag/oxide/sha256";

import {
	SHA512
} from "@gottheflag/oxide/sha512";

const input: HashInput =
	"abc";

const hash: Hash =
	new SHA256();

hash.update(input);

const hex: string =
	hash.digest("hex");

const sha512: Uint8Array =
	new SHA512()
		.update(input)
		.digest();

const mac: string =
	HMAC.sha256("secret")
		.update(input)
		.digest("hex");

void hex;
void sha512;
void mac;

// @ts-expect-error Numbers are not valid HMAC keys.
HMAC.sha256(123);

// @ts-expect-error Internal SHA-2 implementation is not publicly exported.
import { SHA2_64 } from "@gottheflag/oxide/sha2/64/sha2";

void SHA2_64;
`
	);

	writeFileSync(
		join(
			consumer,
			"tsconfig.json"
		),
		JSON.stringify(
			{
				compilerOptions: {
					target: "ES2022",
					module: "NodeNext",
					moduleResolution:
						"NodeNext",
					strict: true,
					noEmit: true,
					skipLibCheck: false
				},
				include: [
					"consumer.ts"
				]
			},
			null,
			2
		)
	);

	run(
		process.execPath,
		[
			tscCli,
			"-p",
			join(
				consumer,
				"tsconfig.json"
			)
		]
	);

	//
	// Verify package metadata survived packing.
	//

	const installedPackage =
		JSON.parse(
			readFileSync(
				join(
					consumer,
					"node_modules",
					"@gottheflag",
					"oxide",
					"package.json"
				),
				"utf8"
			)
		);

	assert.equal(
		installedPackage.name,
		"@gottheflag/oxide"
	);

	assert.ok(
		installedPackage.exports[
		"./hmac"
		]
	);

	succeeded = true;

	console.log(
		"Packed package consumer tests passed."
	);
} finally {
	if (succeeded) {
		rmSync(
			temporary,
			{
				recursive: true,
				force: true
			}
		);
	} else {
		console.error(
			`Packed-package workspace kept for inspection: ${temporary}`
		);
	}
}