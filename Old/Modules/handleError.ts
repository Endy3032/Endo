import rep from "./rep"
import emojis from "./emojis"
import { nordChalk } from "./colors"
import { Interaction, CommandInteraction, MessageComponentInteraction, ModalSubmitInteraction } from "discord.js"

export default (interaction: Interaction, err: Error, type?: string) => {
  rep((interaction as CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction), { content: `${emojis.error.shorthand} This interaction failed [${type || "Unknown"}]\n\`\`\`${err.name}: ${err.message}\`\`\``, ephemeral: true })
  console.botLog(nordChalk.error(err.stack), "ERROR")
}
