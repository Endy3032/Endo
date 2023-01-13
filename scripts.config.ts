import { loadSync as env } from "https://deno.land/std@0.170.0/dotenv/mod.ts"
import { DenonConfig } from "https://deno.land/x/denon@2.5.0/mod.ts"

const cmd = "mod.ts"

export default <DenonConfig> {
	allow: "all",
	env: env(),

	importMap: "./imports.json",
	tsconfig: "./deno.json",

	watch: false,
	watcher: { exts: ["ts"] },

	scripts: {
		dev: {
			cmd,
			watch: true,
		},
		debug: {
			cmd: `denon dev debug`,
			inspect: "127.0.0.1:9229",
			watch: true,
		},
		start: { cmd },
		run: { cmd: "deno run" },
		repl: { cmd: "deno repl" },
		fmt: { cmd: "dprint fmt && eslint --fix ." },
	},
}
