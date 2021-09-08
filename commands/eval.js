const { SlashCommandBuilder } = require('@discordjs/builders')
const BigEval = require('bigeval')
var Math = new BigEval()

module.exports = {
	data: new SlashCommandBuilder()
		.setName('eval')
		.setDescription('Evaluate an expression and return the result')
    .addStringOption(option => 
      option.setName('expression')
            .setDescription('The expression to evaluate [string]')
            .setRequired(true)
    ),
	async execute(interaction) {
    const expression = interaction.options.getString('expression');
    await interaction.reply({ content: `${expression} = ${Math.exec(expression)}` })
    console.log(expression)
	}
}