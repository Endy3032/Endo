const { emojis, nordChalk } = require("../modules")
const { ApplicationCommandOptionType, ButtonStyle, ComponentType, PermissionFlagsBits } = require("discord.js")

module.exports = {
  cmd: {
    name: "clear",
    description: "Clear messages",
    options: [
      {
        name: "amount",
        description: "Amount of messages to clear [integer 1~100]",
        type: ApplicationCommandOptionType.Integer,
        min_value: 1,
        max_value: 100,
        required: true,
      },
      {

      }
    ]
  },

  async execute(interaction) {
    if (!interaction.guild) return await interaction.reply({ content: `${emojis.crossmark.shorthand} This command can only be used in a server`, ephemeral: true })

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
                id: emojis.trash.id
              },
              custom_id: `${amount <= 100 ? amount : 100}`
            }
          ]
        }
      ]

      interaction.reply({ content: `Press \`Confirm\` to delete \`${amount > 100 ? 100 : amount}\` messages or \`Dismiss message\` to cancel.`, components: components, ephemeral: true })
    } else {
      await interaction.reply({ content: `Permissions needed to use the \`clear\` command:\n${manageMsgs ? emojis.checkmark.shorthand : emojis.crossmark.shorthand} \`Manage Messages\`\n${manageGuild ? emojis.checkmark.shorthand : emojis.crossmark.shorthand} \`Manage Server\``, ephemeral: true })
      console.botLog(`${nordChalk.yellow("Permissions")} [ ${manageMsgs ? nordChalk.green("Manage Messages") : nordChalk.red("Manage Messages")} | ${manageGuild ? nordChalk.green("Manage Server") : nordChalk.red("Manage Server")} ]`, "WARN")
    }
  },

  async button(interaction) {
    amount = interaction.customId

    await interaction.channel.bulkDelete(amount)
      .then(console.botLog(`Cleared ${amount} messages`), await interaction.deferUpdate())
      .catch(console.error)
  }
}
