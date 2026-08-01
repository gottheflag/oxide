import { defineConfig } from 'tsup';

export default defineConfig({
	entry: {
		index: "src/index.ts",
		"sha1/index": "src/sha1/index.ts",
	},
	format: [ 'esm', 'cjs' ],
	dts: true,
	sourcemap: true,
	clean: true,
	minify: true,
	treeshake: true,
	splitting: false,
	target: 'es2022',
	outDir: 'dist',
});