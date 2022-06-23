import axiod from "axiod"
import { IAxiodError, IAxiodResponse } from "axiod/interfaces.ts"
import { bold, rgb24 } from "colors"
import { Bot, EventHandlers, getApplicationCommands, User } from "discordeno"
import { activities, BrightNord, Nord, TimeMetric } from "modules"

type Payload = {
  shardId: number
  v: number
  user: User
  guilds: bigint[]
  sessionId: string
  shard?: number[]
  applicationId: bigint
}

export const name: keyof EventHandlers = "ready"
export const execute: EventHandlers["ready"] = async (bot: Bot, payload: Payload) => {
  console.tagLog("Login", `As ${payload.user.username}#${payload.user.discriminator} [v${payload.v} | ${bot.gateway.gatewayBot.sessionStartLimit.remaining} Remaining | ${Deno.build.os == "darwin" ? "Local" : "Cloud"}]`)

  const pinger = () => {
    const servers = ["pinger", "endyjs"]
    servers.forEach(server => {
      axiod.head(`https://${server}.endy3032.repl.co`)
        .catch((err: IAxiodError) => {
          if (err.response) console.botLog(`${rgb24(`[${server}]`, BrightNord.cyan)} ${bold(rgb24(`${err.response.status} ${err.response.statusText}`, Nord.error))}`, "WARN")
        })
    })
  }

  const reloadPresence = async () => {
    const activity = activities()
    await bot.helpers.editBotStatus(activity)
    const activityType = activity.activities[0].type
    const activityName = activity.activities[0].name
    const typeString = ["Playing", "Streaming", "Listening to", "Watching"]
    if (activityName == "lofi" && activity.activities[0].url) {
      const res: IAxiodResponse = await axiod.get(`https://noembed.com/embed?url=${activity.activities[0].url}`)
      console.botLog(`${rgb24("[Status]", BrightNord.cyan)} ${typeString[activityType]} ${activityName} ${rgb24(`${res.data.title} • ${rgb24(activity.activities[0].url?.replace("www.youtube.com/watch?v=", "youtu.be/"), BrightNord.green)}`, BrightNord.cyan)}`)
    } else console.botLog(`${rgb24("[Status]", BrightNord.cyan)} ${typeString[activityType]} ${activityName}`, "INFO", { description: `**Status** • ${typeString[activityType]} ${activityName}` })
  }

  pinger()
  setInterval(() => {
    pinger()
  }, 5 * TimeMetric.milli2min)
  if (Deno.build.os == "linux") {
    setInterval(() => {
      reloadPresence()
    }, 15 * TimeMetric.milli2min)
  }

  const globalCommands = await getApplicationCommands(bot).catch(err => console.botLog(err, "ERROR"))
  console.tagLog("Global", `${globalCommands?.size ?? "Failed Fetching"} Commands`)
  const testGuild = Deno.env.get("TestGuild")
  if (testGuild !== undefined) {
    const testCommands = await getApplicationCommands(bot, BigInt(testGuild)).catch(err => console.botLog(err, "ERROR"))
    console.tagLog(" Test ", `${testCommands?.size ?? "Failed Fetching"} Commands`)
  }
}
