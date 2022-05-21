import { getFiles } from "Modules"
import { ApplicationCommand, Bot, Collection, Interaction } from "discordeno"

type CommandFunction = (bot: Bot, interaction: Interaction) => Promise<void>

export type Command = {
  cmd: ApplicationCommand,
  execute?: CommandFunction,
  button?: CommandFunction,
  select?: CommandFunction,
  autocomplete?: CommandFunction,
  modal?: CommandFunction,
}

const commands = new Collection<string, Command>()

for await (const file of getFiles("./Commands")) {
  if (file == "mod.ts") continue
  const command: Command = await import(`./${file}`)
  commands.set(command.cmd.name, command)
}

export { commands }
