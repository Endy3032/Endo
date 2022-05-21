import { Embed } from "discordeno"
import { LogLevel } from "Modules"
import { Temporal } from "temporal"
declare global {
  interface Console {
    botLog: (content: string | any, logLevel?: LogLevel, embed?: Embed) => void
    localLog: (content: string, logLevel?: LogLevel, log?: boolean) => { content: string, temporal: Temporal.Instant }
    tagLog: (tag: string, content: string, logLevel?: LogLevel) => void
  }
}