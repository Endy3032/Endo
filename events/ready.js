module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

    client.user.setPresence({
      activities: [{ name: '🌧agoraphobic🌧', type: 2 }],
      status: 'dnd'
    });
	},
};