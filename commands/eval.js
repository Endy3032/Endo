const BigEval = require('bigeval')
var Math = new BigEval()

module.exports = {
  cmd: {
    name: "eval",
    description: "Evaluate an expression and return the result",
    options: [
      {
        type: 3,
        name: "expression",
        description: "The expression to evaluate [string]",
        required: true
      }
    ]
  },

  async execute(interaction) {
    symbols = ['π']
    symvalue = ['3.14']

    var expression = interaction.options.getString('expression')

    var expression2 = expression
    symbols.forEach((value, i) => {
      expression2 = expression2.replace(value, symvalue[i])
    })

    await interaction.reply({ content: `${expression} = ${Math.exec(expression2)}` })
    console.log(expression + ' = ' + Math.exec(expression2))
  }
}

// module.exports.help = {
//   name: module.exports.data.name,
//   description: module.exports.data.description,
//   arguments: "<expression [str]>",
//   usage: '`/' + module.exports.data.name + ' <expression>`'
// }