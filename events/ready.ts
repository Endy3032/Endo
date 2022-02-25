import * as os from "os"
import log from "../index"
import { activities } from "../other/misc"
import { Client, PresenceData } from "discord.js"
var axios = require("axios").default

module.exports = {
  name: "ready",
  once: true,
  async execute(client: Client) {
    os.hostname().includes("local")
      ? log("Ready [VSCode - Dev]")
      : log("Ready [Replit - Prod]")

    const servers = ["pinger", "endyjs", "shithole"]

    function pinger() {
      servers.forEach(server => {
        axios.head(`https://${server}.endy3032.repl.co`)
          .catch((err: any) => {
            console.log(typeof err)
            err.response
              ? console.warn(`[${server}] seems to be offline`)
              : console.log(`[${server}] - 200 OK`)
          })
      })
    }

    setInterval(() => {
      if (!os.hostname().includes("local")) {
        const activity = activities[Math.floor(Math.random() * activities.length)] as PresenceData
        client.user.setPresence(activity)

        const type_str = ["Playing", "Streaming", "Listening to", "Watching"]
        const act_type = activity["activities"][0]["type"]
        const act_name = activity["activities"][0]["name"]

        act_name === "lofi"
          ? log(`Current Status: ${type_str[act_type]} ${act_name} - ${activity["activities"][0]["url"]}`)
          : log(`Current Status: ${type_str[act_type]} ${act_name}`)
      }
      pinger()
    }, 300000)

    pinger()
    client.user.setPresence(activities[Math.floor(Math.random() * activities.length)] as PresenceData)
    // clientcmd = client.application.commands.fetch()
    // .then(cmds => console.log(cmds))

    client.application.commands.fetch()
      .then(commands => console.log(`Fetched ${commands.size} global commands`))
      .catch(console.error)

    const guild = client.guilds.cache.get("864972641219248140")
    // commands = guild.commands
    guild.commands.fetch()
      .then(commands => console.log(`Fetched ${commands.size} test commands`))
      .catch(console.error)

    // delete_cmd = false
    // delete_cmd ? guild.commands.set([]) : null
  },
}

/*
const Guilds = client.guilds.cache.map(guild => (guild.id))
const channel = client.channels.cache.get(process.env.LOG)

console.log(Guilds[0])
const guildd = client.guilds.cache.get(String(Guilds[0]))
// console.log(guildd.members.cache.map(guild => (guild.members.username, guild.members.discriminator)))
guildd.members.fetch()
.then((guild) => {console.log(guild)})
// .then((ls)=>{console.log(ls)})
// .catch((er) => {console.error(er)})

await Guilds.forEach(guildId => {
  const guild = client.guilds.cache.get(guildId)
  console.log('Fetching...')
  guild.members.fetch()
  .then(members => {
    console.log(members)
    // members = members.map(mem => mem.code)
    // channel.send(`discord.gg/${invites[0]}\n`)
  })
  .catch((err) => {console.error(err)})
}) */