const { Util } = require('discord.js')

module.exports = {
  cmd: {
    name: "Copy Raw Content",
    description: "",
    type: 3
  },

  async ctxMenu(interaction) {
    content = Util.escapeMarkdown(interaction.targetMessage.content, { codeBlock: true, inlineCode: true, bold: true, italic: true, underline: true, strikethrough: true, spoiler: true, codeBlockContent: true, inlineCodeContent: true })
    await interaction.reply({ content: `${content}`, ephemeral: true })
  },
};
