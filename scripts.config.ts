import { configSync as env } from "https://deno.land/std@0.144.0/dotenv/mod.ts"
import type { DenonConfig } from "https://deno.land/x/denon@2.5.0/mod.ts"

const cmd = "mod.ts"

const config: DenonConfig = {
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
    },
    debug: {
      cmd,
      desc: "Start the bot in dev mode",
      inspect: "127.0.0.1:9229",
    },
    repl: {
      cmd: "deno repl",
      allow: undefined,
    },
  },
  watcher: { exts: ["ts"] },
}

export default config
