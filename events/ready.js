const os = require("os")
var axios = require("axios").default
const index = require("../index")
const { nordChalk } = require("../other/misc")
const { activities } = require("../other/misc")

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    os.hostname().includes("local")
      ? index.log(`${nordChalk.bright.cyan("[VSCode]")} Ready`)
      : index.log(`${nordChalk.bright.cyan("[Replit]")} Ready`)

    servers = ["pinger", "endyjs"]

    function pinger() {
      servers.forEach(server => {
        axios.head(`https://${server}.endy3032.repl.co`)
          .catch((err) => {
            if (err.response) index.log(`${nordChalk.bright.cyan(`[${server}]`)} ${nordChalk.error(`${err.response.status} ${err.response.statusText}`)}`, "WARN")
          })
      })
    }

    setInterval(() => {
      if (!os.hostname().includes("local")) {
        activity = activities[Math.floor(Math.random() * activities.length)]
        client.user.setPresence(activity)

        act_type = activity.activities[0]["type"]
        act_name = activity.activities[0]["name"]
        type_str = ["Playing", "Streaming", "Listening to", "Watching"]

        if (act_name == "lofi") {
          axios.get(`https://noembed.com/embed?url=${activity.activities[0].url}`)
            .then(res => index.log(`${nordChalk.bright.cyan("[Status]")} ${type_str[act_type]} ${act_name} ${nordChalk.bright.cyan(`[${activity.activities[0]["url"].replace("www.youtube.com/watch?v=", "youtu.be/")} - ${res.data.title}]`)}`))
        } else index.log(`${nordChalk.bright.cyan("[Status]")} ${type_str[act_type]} ${act_name}`)
      }
      pinger()
    }, 300000)

    pinger()
    client.user.setPresence(activities[Math.floor(Math.random() * activities.length)])
    // clientcmd = client.application.commands.fetch()
    // .then(cmds => console.log(cmds))

    client.application.commands.fetch()
      .then(commands => index.log(`${nordChalk.bright.cyan("[Global]")} Fetched ${commands.size} commands`))
      .catch(console.error)

    const guild = client.guilds.cache.get("864972641219248140")
    // commands = guild.commands
    guild.commands.fetch()
      .then(commands => index.log(`${nordChalk.bright.cyan("[ Test ]")} Fetched ${commands.size} commands`))
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