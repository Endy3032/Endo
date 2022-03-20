// const { emojis, nordChalk } = require("./index")
const emojis = require("./emojis")
const nordChalk = require("./colors").nordChalk
const { PermissionFlagsBits } = require("discord.js")

module.exports = async (interaction, ...permissions) => {
  if (!interaction.guild) {
    await interaction.reply({ content: `${emojis.crossmark.shorthand} This command can only be used in a server`, ephemeral: true })
    return true
  }

  permissionNames = Object.keys(PermissionFlagsBits).map(permission => permission.match(/[A-Z]?[a-z]+|[0-9]+|[A-Z]+(?![a-z])/g).join(" ").replace("VAD", "VAD (Voice Activity)"))
  const perms = Object.assign(...Object.values(PermissionFlagsBits).map((val, index) => ({ [val]: permissionNames[index] })))

  block = false
  consoleLog = `${nordChalk.yellow("Permissions")} [`
  repContent = `Permissions needed to use the \`${interaction.commandName}${(gr = interaction.options._group) != null ? `/${gr}` : ""}${(sc = interaction.options._subcommand) != null ? `/${sc}` : ""}\` command:`
  permissions.forEach(permission => {
    permName = perms[permission]
    hasPerm = interaction.member.permissions.has(permission)
    if (!hasPerm) block = true

    consoleLog += ` ${hasPerm ? nordChalk.green(permName) : nordChalk.red(permName)},`
    repContent += `\n${hasPerm ? emojis.checkmark.shorthand : emojis.crossmark.shorthand} \`${permName}\``
  })

  if (block) {
    console.botLog(`${consoleLog.slice(0, -1)} ]`, "WARN")
    await interaction.reply({ content: repContent, ephemeral: true })
  }
  return block
}