import { configSync as env } from "https://deno.land/std@0.159.0/dotenv/mod.ts"
import { DenonConfig } from "https://deno.land/x/denon@2.5.0/mod.ts"

const cmd = "mod.ts"

export default <DenonConfig> {
	allow: "all",
	env: env(),
	importMap: "./imports.json",
	tsconfig: "./deno.json",
	scripts: {
		start: {
			cmd,
			desc: "Start the bot",
			watch: false,
		},
		dev: {
			cmd,
			desc: "Start the bot in dev mode",
			inspect: "127.0.0.1:9229",
		},
		fmt: {
			cmd: "dprint fmt && eslint --fix .",
			watch: false,
		},
		repl: {
			cmd: "deno repl",
			watch: false,
		},
	},
	watcher: { exts: ["ts"], skip: ["Commands/*$eval.ts"] },
}
