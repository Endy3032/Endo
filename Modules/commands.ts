import { getFiles } from "./getFiles.ts"
import { ApplicationCommand, Collection, Interaction } from "discordeno"

export type Command = {
  cmd: ApplicationCommand,
  execute?: (interaction: Interaction) => void,
  button?: (interaction: Interaction) => void,
  select?: (interaction: Interaction) => void,
  autocomplete?: (interaction: Interaction) => void,
  modal?: (interaction: Interaction) => void,
}

const commands = new Collection<string, Command>()

for await (const file of getFiles("./Commands")) {
  const command: Command = await import(`./Commands/${file}`)
  commands.set(command.cmd.name, command)
}

export { commands }
