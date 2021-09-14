const dotenv = require('dotenv');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs')

dotenv.config();
// const commands = [].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

commandFiles.forEach(command => {
  const cmd = require(`../commands/${command}`);
  commands.push(cmd.data.toJSON());
});

commands.forEach(command => {
  command.description += ' [G]'
  command.options.forEach(option => {
    option.description += ' [G]'
    if (option.options) {
      option.options.forEach(suboption => {
        suboption.description += ' [G]'
      })
    }
  })
  
  // DEBUG ONLY
  // console.log(command)
});

(async () => {
  try {
    console.log('Started refreshing commands.');
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT, process.env.GUILD),
      { body: commands },
    );
      
    console.log(`Successfully registered ${commandFiles.length} application commands.`);
  }
  catch (error) {console.error(error)}
})();