import { getSubcmd, getSubcmdGroup, getValue } from "Modules"
import { ApplicationCommandTypes, ApplicationCommandOptionTypes, Bot, EventHandlers, Interaction, InteractionTypes, MessageComponentTypes } from "discordeno"

const testGuildID = Deno.env.get("TestGuild")
const testGuildChannel = Deno.env.get("TestChannel")
if (testGuildID === undefined) throw new Error("Test Guild Not Defined")
if (testGuildChannel === undefined) throw new Error("Test Guild Channel Not Defined")

export const name: keyof EventHandlers = "interactionCreate"
export const execute = async (bot: Bot, interaction: Interaction) => {
  // console.log(interaction)
  const isLocal = Deno.build.os == "darwin"
  const isTestGuild = interaction.guildId == BigInt(testGuildID)
  const isReplitTest = interaction.channelId == BigInt(testGuildChannel)
  if ((isLocal && (!isTestGuild || isReplitTest)) || (!isLocal && isTestGuild && !isReplitTest)) return

  const commandName =
  [InteractionTypes.ApplicationCommand, InteractionTypes.ApplicationCommandAutocomplete].includes(interaction.type)
    ? interaction.data?.name.replace(/^(\[.\]) /, "")
    : [InteractionTypes.MessageComponent, InteractionTypes.ModalSubmit].includes(interaction.type)
      ? interaction.message?.interaction?.name
      : "null"

  // console.log(getSubcmd(interaction, ))
  // switch (interaction.data?.componentType) {
  //   case MessageComponentTypes.Button: {
  //     commandName = "button"
  //     break
  //   }

  //   case MessageComponentTypes.SelectMenu: {
  //     commandName = "select"
  //     break
  //   }
  // }
}