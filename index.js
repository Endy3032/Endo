const { Client, Collection, Intents } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');
const Bree = require('bree');


var logStream = fs.createWriteStream('./botlog.log', {flags: 'a'});
dotenv.config();

const client = new Client({intents: [
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_BANS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS
]});

async function log (content) {
  const channel = client.channels.cache.get("769497610300948480");
  log_content = `\`[${new Date().toLocaleString('default', {dateStyle: 'short', timeStyle: 'medium', hour12: false})}]\` ` + content
  console.log(log_content)
  logStream.write(log_content + '\n')
  channel.send(log_content)
}

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
commandFiles.forEach(file => {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command)
})
console.log(client.commands)

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
eventFiles.forEach(file => {
  const event = require(`./events/${file}`);
  event.once
  ? client.once(event.name, (...args) => event.execute(...args))
  : client.on(event.name, (...args) => event.execute(...args));
})

client.login(process.env.TOKEN)

module.exports.log = log;

/* DELETE ALL COMMANDS
client.application.commands.set([]) */