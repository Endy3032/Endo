const { Util } = require("discord.js")

module.exports = (text) => {
  return Util.escapeMarkdown(String(text), { codeBlock: true, inlineCode: true, bold: true, italic: true, underline: true, strikethrough: true, spoiler: true, codeBlockContent: true, inlineCodeContent: true })
}