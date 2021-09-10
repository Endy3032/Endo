module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`[${client.user.tag}][SYSTEM] Ready`);

    client.user.setPresence({
      activities: [{ name: '🌧agoraphobic🌧', type: 2 }],
      status: 'idle'
    });
	},
};