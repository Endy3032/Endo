import { ApplicationCommandOption, ApplicationCommandOptionChoice, ApplicationCommandOptionTypes, ApplicationCommandTypes, Bot,
	Channel, CreateApplicationCommand, Interaction, InteractionDataOption, Member, Message, Role, User } from "discordeno"
import { getCmd, getGroup, getSubcmd } from "./interactionName.ts"

type GuildUser = {
	user: User
	members?: Member
}

type OptionTypeMap = {
	[ApplicationCommandOptionTypes.String]: string
	[ApplicationCommandOptionTypes.Integer]: number
	[ApplicationCommandOptionTypes.Number]: number
	[ApplicationCommandOptionTypes.Boolean]: boolean
	[ApplicationCommandOptionTypes.Channel]: Channel
	[ApplicationCommandOptionTypes.User]: GuildUser
	[ApplicationCommandOptionTypes.Role]: Role
	[ApplicationCommandOptionTypes.Mentionable]: Channel | GuildUser | Role
}

export type DeepReadonly<T extends Readonly<ApplicationCommandOption> | any> = {
	readonly [P in keyof T]: DeepReadonly<T[P]>
}

export type ReadonlyOption = DeepReadonly<ApplicationCommandOption>
export type ReadonlyOptions = DeepReadonly<ApplicationCommandOption[]>

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

type ToOptionType<T extends ReadonlyOption = any> = T extends ReadonlyOption
	? T["choices"] extends DeepReadonly<ApplicationCommandOptionChoice[]> ? T["choices"][number]["value"]
		// @ts-ignore: Type 'T["type"]' cannot be used to index type 'OptionTypeMap'
	: OptionTypeMap[T["type"]]
	: undefined

export type Args<T extends ReadonlyOptions = any> = UnionToIntersection<{
	[K in Exclude<T[number], { required: false }>["name"]]: ToOptionType<Extract<T[number], { name: K }>>
} & {
	[K in Exclude<T[number], { required: true }>["name"]]?: ToOptionType<Extract<T[number], { name: K }>>
}> & {
	name: string
	group: string
	subcommand: string
	message?: Message
	focused: {
		name: string | undefined
		value: string | number | undefined
	}
}

export type InteractionHandler<T extends ReadonlyOptions = any> = (
	bot: Bot,
	interaction: Interaction,
	args: Args<T>,
) =>
	| Promise<any>
	| any

export type CommandHandler<T extends ReadonlyOptions = any> = {
	main: InteractionHandler<T>
	button?: InteractionHandler<T>
	select?: InteractionHandler<T>
	modal?: InteractionHandler<T>
	autocomplete?: InteractionHandler<T>
}

export type Command<T extends ReadonlyOptions = any> = CommandHandler<T> & { cmd: CreateApplicationCommand }

// https://github.com/discordeno/discordeno/blob/main/packages/utils/src/interactions.ts
export function parseOptions<T extends ReadonlyOptions = any>(
	interaction: Interaction,
	options?: InteractionDataOption[],
): Args<T> | Partial<Args<T>> {
	if (!interaction.data) return { name: "", group: "", subcommand: "" } as Partial<Args<T>>
	if (!options) options = interaction.data.options ?? []

	let args = {
		name: getCmd(interaction) ?? "",
		group: getGroup(interaction) ?? "",
		subcommand: getSubcmd(interaction) ?? "",
		focused: {
			name: undefined as string | undefined,
			value: undefined as string | number | undefined,
		},
		// @ts-expect-error: [args] does not satisfy the expected type 'Partial<Args<T>>'
	} satisfies Partial<Args<T>>

	if (interaction.data.type === ApplicationCommandTypes.Message) args["message"] = interaction.data.resolved?.messages?.first()

	if (interaction.data.type === ApplicationCommandTypes.User) {
		args["user"] = interaction.data.resolved?.users?.first()
		args["member"] = interaction.data.resolved?.members?.first()
	}

	for (const option of options) {
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
				args[option.name] = interaction.data.resolved?.channels?.get(BigInt(option.value as string))
				break
			}

			case ApplicationCommandOptionTypes.Role: {
				args[option.name] = interaction.data.resolved?.roles?.get(BigInt(option.value as string))
				break
			}

			case ApplicationCommandOptionTypes.User: {
				args[option.name] = {
					user: interaction.data.resolved?.users?.get(BigInt(option.value as string)),
					member: interaction.data.resolved?.members?.get(BigInt(option.value as string)),
				}
				break
			}

			case ApplicationCommandOptionTypes.Attachment: {
				args[option.name] = interaction.data.resolved?.attachments?.get(BigInt(option.value as string))
				break
			}

			case ApplicationCommandOptionTypes.Mentionable: {
				// Mentionable are roles or users
				args[option.name] = interaction.data.resolved?.roles?.get(BigInt(option.value as string)) ?? {
					user: interaction.data.resolved?.users?.get(BigInt(option.value as string)),
					member: interaction.data.resolved?.members?.get(BigInt(option.value as string)),
				}
				break
			}

			default: {
				args[option.name] = option.value
				if (option.focused) args["focused"] = { name: option.name, value: (option.value as string | number) ?? "" }
			}
		}
	}

	return args as Args<T>
}
