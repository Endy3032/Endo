module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`[${client.user.tag}][SYSTEM] Ready`)

    setInterval(() => {
      activities = [
        {
          activites: [{ name: '/help', type: 2 }],
          status: 'idle'
        },
        {
          activities: [{ name: '🌧agoraphobic🌧', type: 2 }],
          status: 'idle'
        },
        {
          activites: [{ name: 'Stranger Things', type: 3 }],
          status: 'idle'
        },
        {
          activites: [{ name: 'discord.js', type: 0 }],
          status: 'idle'
        },
        {
          activites: [{ name: 'jealous - llusion', type: 2 }],
          status: 'idle'
        },
        {
          activites: [{ name: 'jealous - llusion', type: 2 }],
          status: 'idle'
        }
      ]
      client.user.setActivity(activities[Math.floor(Math.random() * (activities.length - 1) + 1)]);
    }, 60000);

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