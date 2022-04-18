import { Temporal } from "@js-temporal/polyfill"
import { nordChalk } from "./colors"

export const localLog = (content: string, logLevel = "info", doLog = true) => {
  const temporalTime = Temporal.Now.instant()
  const logTime = temporalTime.toLocaleString("default", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false, fractionalSecondDigits: 2
  }).replace(",", "")

  logLevel = logLevel.toLowerCase()
  content = content.replaceAll(process.cwd(), "EndyJS").replaceAll("    ", "  ").replaceAll("\n", "\n                             | ")

  const log = nordChalk.blue(`${logTime} ${nordChalk[logLevel](logLevel.padEnd(5, " ").toUpperCase())} ${`| ${content}`}`)
  if (doLog) console.log(log)
  return { content: log, temporal: temporalTime }
}

export const localTagLog = (tag: string, content: string, logLevel = "info") => localLog(`${nordChalk.bright.cyan(`[${tag}]`)} ${content}`, logLevel)