const { Util } = require("discord.js")

function superEscape(text) {
  return Util.escapeMarkdown(String(text), { codeBlock: true, inlineCode: true, bold: true, italic: true, underline: true, strikethrough: true, spoiler: true, codeBlockContent: true, inlineCodeContent: true })
}

module.exports = superEscape