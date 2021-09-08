const dotenv = require('dotenv')
const BigEval = require('bigeval')
const { Client, Intents, Constants } = require('discord.js')
const { isApplicationCommandDMInteraction } = require('discord-api-types/utils/v9')

dotenv.config()
var CMath = new BigEval()

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS
  ]
});



client.once('ready', () => {
	console.log('Ready!');

  client.user.setPresence(
    {
      activities: [{ name: '🌧agoraphobic🌧', type: 2 }],
      status: 'idle'
    }
  );

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

  /* DELETE ALL COMMANDS
  client.application.commands.set([])
  guild.commands.set([]) */
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) {
    return
  }

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
  }
})

client.login(process.env.TOKEN)