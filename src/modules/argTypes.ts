import { ApplicationCommandOption, ApplicationCommandOptionChoice, ApplicationCommandOptionTypes, Attachment, Bot, Channel,
	CreateApplicationCommand, Interaction, Member, Message, Role, User } from "discordeno"

type UserObj = {
	user: User
	members?: Member
}

type OptionTypeMap = {
	[ApplicationCommandOptionTypes.String]: string
	[ApplicationCommandOptionTypes.Integer]: number
	[ApplicationCommandOptionTypes.Number]: number
	[ApplicationCommandOptionTypes.Boolean]: boolean
	[ApplicationCommandOptionTypes.Channel]: Channel
	[ApplicationCommandOptionTypes.User]: UserObj
	[ApplicationCommandOptionTypes.Role]: Role
	[ApplicationCommandOptionTypes.Mentionable]: UserObj | Role
	[ApplicationCommandOptionTypes.Attachment]: Attachment
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

export type Names = {
	name: string
	group: string
	subcommand: string
}

export type Args<T extends ReadonlyOptions = any> =
	& Names
	& UnionToIntersection<{
		[K in Exclude<T[number], { required: false }>["name"]]: ToOptionType<Extract<T[number], { name: K }>>
	} & {
		[K in Exclude<T[number], { required: true }>["name"]]?: ToOptionType<Extract<T[number], { name: K }>>
	}>
	& {
		user?: User
		member?: Member
		message?: Message
	}
export type InteractionHandler<T extends ReadonlyOptions = any> = (bot: Bot, interaction: Interaction, args: Args<T>) =>
	| Promise<any>
	| any

export type ButtonArgs = Names & { customId: string }
export type ButtonHandler = (bot: Bot, interaction: Interaction, args: ButtonArgs) => Promise<any> | any

export type SelectArgs = Names & { customId: string; values: string[] }
export type SelectHandler = (bot: Bot, interaction: Interaction, args: SelectArgs) => Promise<any> | any

export type AutocompleteArgs<T extends ReadonlyOptions = any> =
	& Names
	& Partial<Args<T>>
	& { focused: { name: string; value: string | number } }
export type AutocompleteHandler<T extends ReadonlyOptions = any> = (
	bot: Bot,
	interaction: Interaction,
	args: AutocompleteArgs<T>,
) => Promise<any> | any

export type CommandHandler<T extends ReadonlyOptions = any> = {
	main: InteractionHandler<T>
	button?: InteractionHandler<T>
	select?: SelectHandler
	modal?: InteractionHandler<T>
	autocomplete?: AutocompleteHandler<T>
}

export type Command<T extends ReadonlyOptions = any> = CommandHandler<T> & { cmd: CreateApplicationCommand }
