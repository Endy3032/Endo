const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`[${client.user.tag}][SYSTEM] Ready`)

    client.user.setPresence({
      activities: [{ name: '🌧agoraphobic🌧', type: 2 }],
      status: 'idle'
    })

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