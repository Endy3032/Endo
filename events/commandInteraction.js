const commandList = require('../commands/help.js')

// console.log(commandList.commandList)

module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
    if (!interaction.isSelectMenu() && !interaction.isButton()) {return}
    
    // if (interaction.message.interaction.commandName === 'clear') {
    //   if (interaction.customId === 'clear_yes') {
    //     var clear = require('../commands/clear.js')
    //     amount = clear.clear_amount
    //     interaction.channel.bulkDelete(amount)
    //       .then(console.log(`Cleared ${amount} messages`))
    //       .catch(console.error);
    //     interaction.reply({ content: `Cleared \`${amount}\` messages`, ephemeral: true })
    //   } else {
    //     interaction.reply({ content: `Action Canceled`, ephemeral: true })
    //   }
    // }

    if (interaction.message.interaction.commandName === 'help' && interaction.customId === 'help_menu') {
      interaction.values[0] === 'info_opt'
      ? console.log(`${interaction.values[0]}`)
      : null
    }
	},
};