import os from "os"
import { Client } from "discord.js"
import axios, { AxiosError, AxiosResponse } from "axios"
import { activities, nordChalk, pickFromArray } from "../Modules"

export const name = "ready"
export const once = true

export async function execute(client: Client) {
  var localUpdated = false
  os.hostname().includes("local")
    ? console.botLog(`${nordChalk.bright.cyan("[VSCode]")} Client Ready`)
    : console.botLog(`${nordChalk.bright.cyan("[Replit]")} Client Ready`)

  function pinger() {
    const servers = ["pinger", "endyjs"]
    servers.forEach(server => {
      axios.head(`https://${server}.endy3032.repl.co`)
        .catch((err: AxiosError) => {
          if (err.response) console.botLog(`${nordChalk.bright.cyan(`[${server}]`)} ${nordChalk.error(`${err.response.status} ${err.response.statusText}`)}`, "WARN")
        })
    })
  }

  function reloadPresence() {
    if (os.hostname().includes("local")) {
      if (localUpdated) return
      localUpdated = true
      return client?.user?.setPresence({ status: "idle" })
    }
    const activity = pickFromArray(activities as [any])
    const act_type = activity.activities[0]["type"]
    const act_name = activity.activities[0]["name"]
    const type_str = ["Playing", "Streaming", "Listening to", "Watching"]

    client?.user?.setPresence(activity)

    if (act_name == "lofi") {
      axios.get(`https://noembed.com/embed?url=${activity.activities[0].url}`)
        .then((res: AxiosResponse) => {console.botLog(`${nordChalk.bright.cyan("[Status]")} ${type_str[act_type]} ${act_name} ${nordChalk.bright.cyan(`${res.data.title} • ${activity.activities[0]["url"].replace("www.youtube.com/watch?v=", "youtu.be/")}`)}`)})
    } else console.botLog(`${nordChalk.bright.cyan("[Status]")} ${type_str[act_type]} ${act_name}`, "INFO", { description: `**Status** • ${type_str[act_type]} ${act_name}` })
  }

  pinger()
  reloadPresence()
  setInterval(() => { pinger() }, 5 * 60 * 1000)
  setInterval(() => { reloadPresence() }, 15 * 60 * 1000)

  client?.application?.commands.fetch()
    .then(commands => console.botLog(`${nordChalk.bright.cyan("[Global]")} Fetched ${commands.size} commands`))
    .catch(console.error)

  const guild = client.guilds.cache.get("864972641219248140")

  guild?.commands.fetch()
    .then(commands => console.botLog(`${nordChalk.bright.cyan("[ Test ]")} Fetched ${commands.size} commands`))
    .catch(console.error)
}
