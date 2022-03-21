const { PermissionFlagsBits } = require("discord.js")

permissionNames = Object.keys(PermissionFlagsBits).map(permission => permission.match(/[A-Z]?[a-z]+|[0-9]+|[A-Z]+(?![a-z])/g).join(" ").replace("VAD", "VAD (Voice Activity)"))
module.exports = Object.assign(...Object.values(PermissionFlagsBits).map((val, index) => ({ [val]: permissionNames[index] })))
