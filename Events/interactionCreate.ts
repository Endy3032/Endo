import { Bot, EventHandlers, Interaction } from "discordeno"

export const name: keyof EventHandlers = "interactionCreate"
export const execute = async (bot: Bot, interaction: Interaction) => {
  console.log(interaction)
}