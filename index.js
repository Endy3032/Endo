const dotenv = require('dotenv');
const BigEval = require('bigeval');
const { Client, Collection, Constants, Intents } = require('discord.js');
const fs = require('fs');

dotenv.config();
var CMath = new BigEval();

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

/*
client.once('ready', c => {
	console.log(`[${c.user.tag}] - Ready!`);
  const guild = client.guilds.cache.get('864972641219248140')
  let commands

  if (guild) {
    commands = guild.commands
  } else {
    commands = client.application?.commands
  }

  commands?.create({
    name: 'ping',
    description: 'Test Ping command'
  })
  
  commands?.create({
    name: 'math',
    description: 'Do a math expression and return the result',
    options: [
      {
        name: 'expression',
        description: 'The expression to evaluate',
        required: true,
        type: Constants.ApplicationCommandOptionTypes.STRING
      }
    ]
  })

  commands?.create({
    name: 'say',
    description: 'Make the bot say something',
    options: [
      {
        name: 'content',
        description: 'The content of the message',
        required: true,
        type: Constants.ApplicationCommandOptionTypes.STRING
      }
    ]
  })
  
})
DELETE ALL COMMANDS
client.application.commands.set([])
guild.commands.set([]) */

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) {return}

  const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {await command.execute(interaction)}
  catch (error) {
		console.error(error);
		await interaction.reply({ content: 'This interaction failed (without the red coloring :D)', ephemeral: true });
	}

  /*
  const { commandName, options } = interaction

  if (commandName === 'ping') {
    interaction.reply({
      content: 'pong',
      ephemeral: false
    })
  } else if (commandName === 'math') {
    const expression = options.getString('expression')
    interaction.reply({
      content: `${expression} = ${CMath.exec(expression)}`,
      ephemeral: false
    })
  } else if (commandName === 'say') {
    const content = options.getString('content')
    interaction.reply({
      content: `${content}`,
      ephemeral: false
    })
  } */
})

client.login(process.env.TOKEN)