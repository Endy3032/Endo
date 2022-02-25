const chalk = require("chalk")
const { emojis } = require("../other/misc")
const { ApplicationCommandOptionType, ButtonStyle, ComponentType, PermissionFlagsBits } = require("discord.js")

module.exports = {
  cmd: {
    name: "clear",
    description: "Clear messages in the channel",
    options: [
      {
        type: ApplicationCommandOptionType.Integer,
        name: "amount",
        description: "Amount of messages to clear [integer 1~100]",
        required: true,
        min_value: 1,
        max_value: 100
      }
    ]
  },

  async execute(interaction) {
    if (!interaction.guild) return await interaction.reply({ content: `${emojis.crossmark} This command can only be used in a server`, ephemeral: true })

    const manageMsgs = interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)
    const manageGuild = interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)

    if (manageMsgs && manageGuild) {
      const amount = interaction.options.getInteger("amount")

      components = [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.Button,
              style: ButtonStyle.Danger,
              label: "Confirm",
              emoji: {
                name: "trash",
                id: "927050313943380089"
              },
              custom_id: `${amount <= 100 ? amount : 100}`
            }
          ]
        }
      ]

      amount <= 100
        ? interaction.reply({ content: `Press \`Confirm\` to delete \`${amount}\` messages or \`Dismiss message\` to cancel.`, components: components, ephemeral: true })
        : interaction.reply({ content: "Press `Confirm` to delete `100` messages or `Dismiss message` to cancel. (100 max clear safety)", components: components, ephemeral: true })
    } else {
      await interaction.reply({ content: `You can't use the \`clear\` command without having \`Manage Messages\` and \`Manage Server\` permissions.\nYou currently have:\n${manageMsgs ? emojis.checkmark : emojis.crossmark} \`Manage Messages\`\n${manageGuild ? emojis.checkmark : emojis.crossmark} \`Manage Server\``, ephemeral: true })
      console.log(`${chalk.yellow("Missing Permissions")} | ${manageMsgs ? chalk.green("Manage Messages") : chalk.red("Manage Messages")} | ${manageGuild ? chalk.green("Manage Server") : chalk.red("Manage Server")}`)
    }
  },

  async button(interaction) {
    amount = interaction.customId

    await interaction.channel.bulkDelete(amount)
      .then(console.log(`Cleared ${amount} messages`), await interaction.deferUpdate())
      .catch(console.error)
  }
}

// module.exports.help = {
//   name: module.exports.data.name,
//   description: module.exports.data.description,
//   arguments: "<amount [int 1~100]>",
//   usage: '`/' + module.exports.data.name + ' <amount>`'
// }