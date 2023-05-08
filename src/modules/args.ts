import { ApplicationCommandOptionTypes, ApplicationCommandTypes, Interaction, InteractionDataOption,
	InteractionTypes } from "discordeno"
import { Args, AutocompleteArgs, ButtonArgs, Names, ReadonlyOptions, SelectArgs } from "./argTypes.ts"
import { getCmd, getGroup, getSubcmd } from "./interactionName.ts"

// https://github.com/discordeno/discordeno/blob/main/packages/utils/src/interactions.ts
export function parseOptions<T extends ReadonlyOptions = any>(
	interaction: Interaction,
	options?: InteractionDataOption[],
): Args<T> | ButtonArgs | SelectArgs | AutocompleteArgs<T> {
	if (!interaction.data) return { name: "", group: "", subcommand: "" } as Args<T>
	if (!options) options = interaction.data.options ?? []

	const names: Names = {
		name: getCmd(interaction) ?? "",
		group: getGroup(interaction) ?? "",
		subcommand: getSubcmd(interaction) ?? "",
	}

	if (interaction.type === InteractionTypes.MessageComponent) {
		return {
			...names,
			customId: interaction.data.customId!,
			values: interaction.data.values ?? [],
		} satisfies ButtonArgs | SelectArgs
	}

	let args = {
		...names,
		// @ts-expect-error: [args] does not satisfy the expected type 'Partial<Args<T>>'
	} satisfies Partial<Args<T>>

	if (interaction.data.type === ApplicationCommandTypes.Message) args["message"] = interaction.data.resolved?.messages?.first()
	else if (interaction.data.type === ApplicationCommandTypes.User) {
		args["user"] = interaction.data.resolved?.users?.first()
		args["member"] = interaction.data.resolved?.members?.first()
	}

	for (const option of options) {
		let value: bigint | undefined
		if ([
			ApplicationCommandOptionTypes.Channel,
			ApplicationCommandOptionTypes.User,
			ApplicationCommandOptionTypes.Role,
			ApplicationCommandOptionTypes.Mentionable,
			ApplicationCommandOptionTypes.Attachment,
		].includes(option.type)) value = BigInt(option.value?.toString() as string)

		switch (option.type) {
			case ApplicationCommandOptionTypes.SubCommandGroup:
			case ApplicationCommandOptionTypes.SubCommand: {
				args = {
					...args,
					...parseOptions(interaction, option.options),
				}
				break
			}

			case ApplicationCommandOptionTypes.Channel: {
				args[option.name] = interaction.data.resolved?.channels?.get(value!)
				break
			}

			case ApplicationCommandOptionTypes.User: {
				args[option.name] = {
					user: interaction.data.resolved?.users?.get(value!),
					member: interaction.data.resolved?.members?.get(value!),
				}
				break
			}

			case ApplicationCommandOptionTypes.Role: {
				args[option.name] = interaction.data.resolved?.roles?.get(value!)
				break
			}

			case ApplicationCommandOptionTypes.Mentionable: {
				args[option.name] = interaction.data.resolved?.roles?.get(value!) ?? {
					user: interaction.data.resolved?.users?.get(value!),
					member: interaction.data.resolved?.members?.get(value!),
				}
				break
			}

			case ApplicationCommandOptionTypes.Attachment: {
				args[option.name] = interaction.data.resolved?.attachments?.get(value!)
				break
			}

			default: {
				args[option.name] = option.value
				if (option.focused) args["focused"] = { name: option.name, value: (option.value as string | number) ?? "" }
				break
			}
		}
	}

	return args as Args<T>
}
