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
    symbols = ['π']
    symvalue = ['3.14']

    var expression = interaction.options.getString('expression')
    var expression_2 = expression
    symbols.forEach(value => {
      expression_2 = expression_2.replace(value, symvalue[symbols.indexOf(value)])
    })

    await interaction.reply({ content: `${expression} = ${Math.exec(expression_2)}` })
    console.log(expression + ' = ' + expression_2)
	}
}