import { ActionRow, ApplicationCommandOption, ApplicationCommandOptionTypes, Bot, ButtonComponent, ButtonStyles, DiscordEmbedField,
	Interaction, MessageComponents, MessageComponentTypes, TextStyles } from "discordeno"
import { capitalize, colors, getCmdName, getValue, pickArray, randRange, respond } from "modules"
import { splitBar } from "progressbar"
import { Temporal } from "temporal"

export const cmd: ApplicationCommandOption = {
	name: "poll",
	description: "Make a poll [Unfinished]",
	type: ApplicationCommandOptionTypes.SubCommand,
}

export async function main(bot: Bot, interaction: Interaction) {
	const placeholder = pickArray([
		["Do you like pineapples on pizza?", "Yes", "No", "Why even?", "What the heck is a pineapple pizza"],
		["Where should we go to eat today", "McDonald's", "Burger King", "Taco Bell", "Wendy's"],
		["What's your favorite primary color?", "Red", "Green", "Green", "Yellow"],
	])

	await respond(bot, interaction, {
		title: "Create a Poll",
		customId: "utils/poll",
		components: placeholder.map<ActionRow>((e, i) => ({
			type: MessageComponentTypes.ActionRow,
			components: [{
				type: MessageComponentTypes.InputText,
				customId: i === 0 ? "question" : `option${i}`,
				style: TextStyles.Short,
				label: i === 0 ? "Question" : `Option ${i}`,
				placeholder: e,
				required: i < 3,
			}],
		})),
	}, true)
}

export async function button(bot: Bot, interaction: Interaction) {
	if (getCmdName(interaction) == "poll") {
		const embed = interaction.message?.embeds[0]
		// let user = embed.description?.split(" ").at(-1) as string
		// user = user.slice(2, user.length - 1)
		// switch(true) {
		//   case interaction.customId.startsWith("poll"): {
		//     switch(interaction.customId.slice(5)) {
		//       case "close": {
		//         console.log("close")
		//         if (interaction.user.id == user) {await interaction.message.edit({ components: [] })}
		//         else {await interaction.reply({ content: "You cannot close this poll", ephemeral: true })}
		//         break
		//       }
		//     }
		//     break
		//   }
		// }
	}
}

export async function modal(bot: Bot, interaction: Interaction) {
	const question = getValue(interaction, "question", "String")!
	const option1 = getValue(interaction, "option1", "String")!
	const option2 = getValue(interaction, "option2", "String")!
	const option3 = getValue(interaction, "option3", "String")
	const option4 = getValue(interaction, "option4", "String")

	const amount = Math.floor(Math.random() * 1000)

	const options = [option1, option2, option3, option4].filter(e => e !== undefined) as string[]

	const fields: DiscordEmbedField[] = options.map(opt => {
		const split = splitBar(100, randRange(0, 100), 25)

		return {
			name: `${capitalize(opt)} • 0/${amount} Votes • ${split[1]}%`,
			value: `[${split[0]}]`,
			inline: false,
		}
	})
	const components: MessageComponents = [
		{
			type: MessageComponentTypes.ActionRow,
			components: options.map<ButtonComponent>((opt, i) => ({
				type: MessageComponentTypes.Button,
				label: opt,
				style: ButtonStyles.Primary,
				customId: `poll_${i}_0`,
			})) as [ButtonComponent],
		},
		{
			type: MessageComponentTypes.ActionRow,
			components: [{
				type: MessageComponentTypes.Button,
				style: ButtonStyles.Danger,
				label: "Close Poll",
				customId: "poll_close",
			}],
		},
	]

	const timestamp = Temporal.Now.instant()

	await respond(bot, interaction, {
		embeds: [{
			title: `Poll - ${question.charAt(0).toUpperCase() + question.slice(1)}`,
			color: pickArray(colors),
			description: `0 votes so far\nPoll Created <t:${timestamp.epochSeconds}:R> by <@${interaction.user.id}>`,
			fields: fields,
			footer: { text: "Last updated" },
			timestamp: timestamp.epochMilliseconds,
		}],
		components,
	})
}
