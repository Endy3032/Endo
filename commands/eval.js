const { SlashCommandBuilder } = require('@discordjs/builders')
const BigEval = require('bigeval')
var Math = new BigEval()

module.exports = {
	data: new SlashCommandBuilder()
		.setName('eval')
		.setDescription('Evaluate an expression and return the result')
    .addStringOption(option => 
      option.setName('expression')
            .setDescription('The expression to evaluate')
            .setRequired(true)
          //.setType(Constants.ApplicationCommandOptionTypes.STRING)
    ),
	async execute(interaction) {
    interaction.reply('Not Working')
	}
}