import type { DenonConfig } from "https://deno.land/x/denon@2.5.0/mod.ts"
import { configSync as env } from "https://deno.land/std@0.138.0/dotenv/mod.ts"

const cmd = "mod.ts"

const config: DenonConfig = {
  allow: "all",
  env: env(),
  importMap: "./imports.json",
  tsconfig: "./deno.json",
  noCheck: true,
  scripts: {
    start: {
      cmd,
      desc: "Start the bot",
      watch: false
    },
    dev: {
      cmd,
      desc: "Start the bot in dev mode",
    }
  },
  watcher: { exts: ["ts"] },
}

export default config