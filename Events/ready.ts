import axiod from "axiod"
import { bold, rgb24 } from "colors"
import { Bot, editBotStatus, EventHandlers, getApplicationCommands, StatusUpdate, User } from "discordeno"
import type { IAxiodError, IAxiodResponse } from "axiod/interfaces.ts"
import { activities, BrightNord, Nord, TimeMetric } from "Modules"

type Payload = {
  shardId: number;
  v: number;
  user: User;
  guilds: bigint[];
  sessionId: string;
  shard?: number[];
  applicationId: bigint;
}

export const name: keyof EventHandlers = "ready"
export const execute: EventHandlers["ready"] = async (bot: Bot, payload: Payload) => {
  var localUpdated = false
  console.tagLog("Login", `As ${payload.user.username}#${payload.user.discriminator} [${bot.botGatewayData?.sessionStartLimit.remaining} Remaining | ${Deno.build.os == "darwin" ? "VSCode" : "Replit"}]`)

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
    const activity = activities
    if (Deno.build.os == "darwin" && localUpdated) return
    localUpdated = true
    editBotStatus(bot, activity)
    const act_type = activity.activities[0]["type"]
    const act_name = activity.activities[0]["name"]
    const type_str = ["Playing", "Streaming", "Listening to", "Watching"]
    if (act_name == "lofi") {
      const res: IAxiodResponse = await axiod.get(`https://noembed.com/embed?url=${activity.activities[0].url}`)
      console.botLog(`${rgb24("[Status]", BrightNord.cyan)} ${type_str[act_type]} ${act_name} ${rgb24(`${res.data.title} • ${activity.activities[0].url?.replace("www.youtube.com/watch?v=", "youtu.be/")}`, BrightNord.cyan)}`)
    } else console.botLog(`${rgb24("[Status]", BrightNord.cyan)} ${type_str[act_type]} ${act_name}`, "INFO", { description: `**Status** • ${type_str[act_type]} ${act_name}` })
  }

  pinger()
  reloadPresence()
  setInterval(() => { pinger() }, 5 * TimeMetric.milli2min)
  setInterval(() => { reloadPresence() }, 15 * TimeMetric.milli2min)

  const globalCommands = await getApplicationCommands(bot)
  console.tagLog("Global", `${globalCommands.size} Commands`)
  const testGuild = Deno.env.get("TestGuild")
  if (testGuild !== undefined) {
    const testCommands = await getApplicationCommands(bot, BigInt(testGuild))
    console.tagLog(" Test ", `${testCommands.size} Commands`)
  }
}
