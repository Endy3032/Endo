import { Embed } from "discordeno"
import { LogLevel } from "modules"
import { Temporal } from "temporal"

interface Log {
  content: string
  temporal: Temporal.Instant
}

declare global {
  interface Console {
    tagLog: (tag: string, content: string, logLevel?: LogLevel) => void
    localLog: (content: string, logLevel?: LogLevel, log?: boolean) => Log
    botLog: (content: string | any, logLevel?: LogLevel, embed?: Embed) => void
  }
}
