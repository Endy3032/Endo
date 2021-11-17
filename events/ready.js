var axios = require("axios").default
const index = require("../index.js")
const misc = require("../other/misc.js")
const activities = misc.activities


module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    index.log(`Ready`)

    servers = ['pinger', 'endyjs']

    function pinger() {
      servers.forEach(server => {
        axios.head(`https://${server}.enderhoang.repl.co`)
        .catch(function(error) {
          error.response
          ? console.log(`${error.response.status} - Repl seems to be offline`)
          : null
        })
      })
    }

    setInterval(() => {
      activity = activities[Math.floor(Math.random() * activities.length)]
      client.user.setPresence(activity)
      
      act_type = activity['activities'][0]['type']
      act_name = activity['activities'][0]['name']
      type_str = ['Playing', 'Streaming', 'Listening to', 'Watching']
      
      act_name === 'lofi'
      ? index.log(`Current Status: ${type_str[act_type]} ${act_name} - ${activity['activities'][0]['url']}`)
      : index.log(`Current Status: ${type_str[act_type]} ${act_name}`)

      pinger()
    }, 900000)
    
    pinger()
    client.user.setPresence(activities[Math.floor(Math.random() * activities.length)])

    // clientcmd = client.application.commands.fetch()
    // .then(cmds => console.log(cmds))
    
    delete_cmd = false

    const guild = client.guilds.cache.get('864972641219248140')
    // commands = guild.commands

    client.application.commands.fetch()
    .then(commands => console.log(`Fetched ${commands.size} global commands`))
    .catch(console.error)

    guild.commands.fetch()
    .then(commands => console.log(`Fetched ${commands.size} test commands`))
    .catch(console.error)
    
    delete_cmd ? guild.commands.set([]) : null
  },
}