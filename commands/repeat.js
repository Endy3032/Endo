module.exports = {
  cmd: {
    name: "repeat",
    description: "Repeat something",
    options: [
      {
        type: 3,
        name: "message",
        description: "The message to repeat [string]",
        required: true
      },
      {
        type: 4,
        name: "times",
        description: "The number of times to repeat the message [int 1~10, default 3]",
        "min-value": 1,
        "max-value": 10,
        required: false
      }
    ]
  },

  async execute(interaction) {
    function rep(msg, x) {
      setTimeout(function() {interaction.channel.send(msg)}, 500 * x)
    }

    const message = interaction.options.getString('message')
    var times = interaction.options.getInteger('times') || 3

    times > 10 ? (times = 10, response += '\nNote: 10 times maximum') : times
    response = `Dispatching "${message}" ${times} times`
    
    if (interaction.guild) {
      await interaction.reply({content: response, ephemeral: true})
      for (let i = 0; i < times; i++) {rep(message, i)}
    }
    else {
      await interaction.reply("This command can't be used in DM or any other places except for server channels.")
    }
  },
};

// module.exports.help = {
//   name: module.exports.data.name,
//   description: module.exports.data.description,
//   arguments: "none",
//   usage: '`/' + module.exports.data.name + '`'
// }