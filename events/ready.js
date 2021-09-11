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
	},
};