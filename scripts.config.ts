import { loadSync as env } from "https://deno.land/std@0.170.0/dotenv/mod.ts"
import { DenonConfig } from "https://deno.land/x/denon@2.5.0/mod.ts"

const cmd = "mod.ts", inspect = "127.0.0.1:9229"

export default <DenonConfig> {
	allow: "all",
	env: env(),

	tsconfig: "./deno.json",

	watch: false,
	watcher: {
		exts: ["ts", "tsx"],
		skip: ["./Old/*.*"],
	},

	scripts: {
		dev: {
			cmd,
			watch: true,
			inspect,
		},
		start: { cmd, inspect },
		repl: { cmd: "deno repl" },
		fmt: { cmd: "dprint fmt && eslint --fix ." },
	},
}
