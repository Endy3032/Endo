var axios = require("axios").default
const index = require("../index.js")
const misc = require("../other/misc.js")
const activities = misc.activities
const os = require("os")

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    os.hostname().indexOf("local") > -1
      ? index.log("Ready [VSCode]")
      : index.log("Ready [Replit]")

    servers = ["pinger", "endyjs"]

    function pinger() {
      servers.forEach(server => {
        axios.head(`https://${server}.endy3032.repl.co`)
          .catch(function(error) {
            error.response
              ? console.log(`${error.response.status} - [${server}] seems to be offline`)
              : null
          })
      })
    }

    setInterval(() => {
      if (!(os.hostname().indexOf("local") > -1)) {
        activity = activities[Math.floor(Math.random() * activities.length)]
        client.user.setPresence(activity)
        
        act_type = activity["activities"][0]["type"]
        act_name = activity["activities"][0]["name"]
        type_str = ["Playing", "Streaming", "Listening to", "Watching"]
        
        act_name === "lofi"
          ? index.log(`Current Status: ${type_str[act_type]} ${act_name} - ${activity["activities"][0]["url"]}`)
          : index.log(`Current Status: ${type_str[act_type]} ${act_name}`)
      }
      pinger()
    }, 300000)

    pinger()
    client.user.setPresence(activities[Math.floor(Math.random() * activities.length)])

    // clientcmd = client.application.commands.fetch()
    // .then(cmds => console.log(cmds))
    
    const guild = client.guilds.cache.get("864972641219248140")
    // commands = guild.commands
    
    client.application.commands.fetch()
      .then(commands => console.log(`Fetched ${commands.size} global commands`))
      .catch(console.error)

    guild.commands.fetch()
      .then(commands => console.log(`Fetched ${commands.size} test commands`))
      .catch(console.error)
    
    delete_cmd = false
    delete_cmd ? guild.commands.set([]) : null
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