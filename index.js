const dotenv = require('dotenv');
const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
dotenv.config();

const client = new Client({intents: [
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_BANS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS
]});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
commandFiles.forEach(file => {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command)
})

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
eventFiles.forEach(file => {
  const event = require(`./events/${file}`);
  event.once
  ? client.once(event.name, (...args) => event.execute(...args))
  : client.on(event.name, (...args) => event.execute(...args));
})

client.on('interactionCreate', async (interaction) => {
  const command = client.commands.get(interaction.commandName);

  if (!interaction.isSelectMenu() && !interaction.isCommand()) {return}
  
  if (interaction.isSelectMenu()) {
    try {
      interaction.message.interaction.commandName === 'help'
      ? console.log(`${interaction.values[0]}`)
      : null
    }
    catch(error) {
      console.error(error)
    }
  }

  if (interaction.isCommand()) {
    try {await command.execute(interaction)}
    catch (error) {
      console.error(error);
      await interaction.reply({ content: 'This interaction failed (without the red coloring :D)', ephemeral: true });
    }
  }
})

client.login(process.env.TOKEN)
/* DELETE ALL COMMANDS
client.application.commands.set([])
guild.commands.set([]) */