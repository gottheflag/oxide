import { defineConfig } from 'tsup';

export default defineConfig({
	entry: {
		index: "src/index.ts",
		"hmac/index":
			"src/hmac/index.ts",
		"sha1/index":
			"src/sha1/index.ts",
		"sha224/index":
			"src/sha224/index.ts",
		"sha256/index":
			"src/sha256/index.ts",
		"sha384/index":
			"src/sha384/index.ts",
		"sha512/index":
			"src/sha512/index.ts",
		"sha512-224/index":
			"src/sha512-224/index.ts",
		"sha512-256/index":
			"src/sha512-256/index.ts"
	},
	format: [
		"esm",
		"cjs"
	],
	dts: true,
	clean: true,
	sourcemap: true,
	minify: true,
	treeshake: true,
	splitting: false,
	target: "es2022",
	outDir: "dist",
});