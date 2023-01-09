import { rgb24, stripColor } from "colors"
import { stripIndents } from "commonTags"
import { Bot, Embed, EventHandlers, Interaction, InteractionTypes, MessageComponentTypes } from "discordeno"
import { BrightNord, Command, getCmdName, getSubcmd, getSubcmdGroup, imageURL, InteractionHandler, respond, shorthand,
	toTimestamp } from "modules"
import { commands } from "~/Commands/mod.ts"

const [testGuildID, testGuildChannel] = [Deno.env.get("TestGuild"), Deno.env.get("TestChannel")]

export const name: keyof EventHandlers = "interactionCreate"

export const main = async (bot: Bot, interaction: Interaction) => {
	const isLocal = Deno.build.os == "darwin"
	const isTestGuild = interaction.guildId == BigInt(testGuildID ?? "0")
	const isReplitTest = interaction.channelId == BigInt(testGuildChannel ?? "0")
	if ((isLocal && (!isTestGuild || isReplitTest)) || (!isLocal && isTestGuild && !isReplitTest)) return

	const [commandName, subcmd, group] = [getCmdName(interaction), getSubcmd(interaction), getSubcmdGroup(interaction)]

	if (interaction.type != InteractionTypes.ApplicationCommandAutocomplete) {
		const guild = interaction.guildId ? await bot.helpers.getGuild(interaction.guildId) : null
		const guildName = guild?.name ?? null
		const channelName = interaction.channelId ? (await bot.helpers.getChannel(BigInt(interaction.channelId)))?.name : null
		const invoker = rgb24(
			`[${interaction.user.username}#${interaction.user.discriminator} | ${guildName ? `${guildName} #${channelName}` : "DM"}] `,
			BrightNord.cyan,
		)

		const interactionLog = interaction.type == InteractionTypes.ApplicationCommand
			? `Triggered ${rgb24(`/${[commandName, group, subcmd].join(" ").replaceAll("  ", " ")}`, BrightNord.cyan)}`
			: interaction.type == InteractionTypes.MessageComponent && interaction.data?.componentType == MessageComponentTypes.Button
			? `Selected ${rgb24(`[${commandName}/${interaction.data?.values?.join("|") ?? interaction.data.customId}]`, BrightNord.cyan)}`
			: interaction.type == InteractionTypes.ModalSubmit
			? `Submitted ${rgb24(`[${commandName}/${interaction.data?.customId}]`, BrightNord.cyan)}`
			: "Unknown Interaction"

		const discordTimestamp = toTimestamp(interaction.id)

		const embed: Embed = {
			description: stripColor(
				`<t:${discordTimestamp}:T> <t:${discordTimestamp}:d> [${discordTimestamp}]\n**Interaction** • ${interactionLog}`,
			),
			author: { name: `${interaction.user.username}#${interaction.user.discriminator}`,
				iconUrl: imageURL(interaction.user.id, interaction.user.avatar, "avatars") },
			footer: { text: guildName ? `${guildName} #${channelName}` : "**DM**", iconUrl: imageURL(guild?.id, guild?.icon, "icons") },
			timestamp: Number(discordTimestamp),
		}

		console.botLog(invoker + interactionLog, { logLevel: "INFO", embed })
	}

	const command = commands.get(commandName ?? "undefined") as Command
	let exec: InteractionHandler | undefined = command.main, type = "Command"

	if (interaction.type === InteractionTypes.MessageComponent) {
		if (interaction.data?.componentType === MessageComponentTypes.Button) {
			exec = command?.button
			type = "Button"
		} else {
			exec = command?.select
			type = "Select Menu"
		}
	} else if (interaction.type === InteractionTypes.ModalSubmit) {
		exec = command?.modal
		type = "Modal"
	} else if (interaction.type === InteractionTypes.ApplicationCommandAutocomplete) {
		exec = command?.autocomplete
		type = "Autocomplete"
	}

	if (!exec || !command) {
		console.botLog(`No ${type} handler found for \`${commandName}\``, { logLevel: "ERROR" })
		return respond(bot, interaction, `${shorthand("error")} No handler found for ${commandName}`, true)
	}

	try {
		await exec(bot, interaction)
	} catch (e) {
		console.botLog(e, { logLevel: "ERROR" })

		let content = stripIndents`${shorthand("error")} Something failed back here... Techy debug stuff below\`\`\`
				${Deno.inspect(e, { colors: false, compact: true, depth: 6, iterableLimit: 200 })}`
			.replaceAll("    ", "  ")
			.replaceAll(Deno.cwd(), "Endo")

		if (content.length > 1997) content = content.slice(0, 1994) + "..."
		content += "```"

		await respond(bot, interaction, content, true)
	}
}
