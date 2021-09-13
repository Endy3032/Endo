const misc = require("../other/misc.js")
activities = misc.activities


module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`[${client.user.tag}][SYSTEM] Ready`)

    setInterval(() => {
      activity = activities[Math.floor(Math.random() * activities.length)]
      client.user.setPresence(activity)
      act_type = activity['activities'][0]['type']
      act_name = activity['activities'][0]['name']
      act_types = ['Playing', 'Streaming', 'Listening to', 'Watching']
      misc.log(`Current Status: ${act_types[act_type]} ${act_name}`)
      act_name === 'lofi'
      ? misc.log(activity['activities'][0]['url'])
      : null
    }, 300000);
    client.user.setPresence(activities[Math.floor(Math.random() * activities.length)])
    
    channel = client.channels.cache.get("769497610300948480");
    channel.send({content: '`[NOTIFICATION]` System Online'})

    const guild = client.guilds.cache.get('864972641219248140')
    delete_cmd = false
    commands = guild.commands
    guild.commands.fetch()
    .then(commands => console.log(`Fetched ${commands.size} commands`))
    .catch(console.error);
    delete_cmd ? guild.commands.set([]) : null
  },
};