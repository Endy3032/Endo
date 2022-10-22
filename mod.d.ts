// deno-lint-ignore-file no-explicit-any
import { Embed } from "discordeno"
import { LogLevel, LogOptions } from "modules"

declare global {
	interface Console {
		// localLog: (content: any, logLevel?: LogLevel) => Log
		// tagLog: (tag: string, content: string, logLevel?: LogLevel) => void
		// botLog: (content: any, logLevel?: LogLevel, embed?: Embed) => void
		botLog: (content: any, options?: LogOptions) => Promise<void>
	}
}
