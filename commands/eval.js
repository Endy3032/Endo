const BigEval = require("bigeval")
const { ApplicationCommandOptionType } = require("discord.js")

var Math = new BigEval()

module.exports = {
  cmd: {
    name: "eval",
    description: "Evaluate an expression and return the result",
    options: [
      {
        type: ApplicationCommandOptionType.String,
        name: "expression",
        description: "The expression to evaluate [string]",
        required: true
      }
    ]
  },

  async execute(interaction) {
    symbols = ["π", "τ"]
    symvals = [Math.PI, Math.PI * 2]

    expression = interaction.options.getString("expression")
    expression2 = expression
    symbols.forEach((value, i) => {
      expression2 = expression2.replace(value, symvals[i])
    })

    result = `${expression} = ${Math.exec(expression2)}`

    console.log(result)
    await interaction.reply({ content: result })
  }
}

// module.exports.help = {
//   name: module.exports.data.name,
//   description: module.exports.data.description,
//   arguments: "<expression [str]>",
//   usage: '`/' + module.exports.data.name + ' <expression>`'
// }