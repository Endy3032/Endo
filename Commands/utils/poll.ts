import { ApplicationCommandOption, ApplicationCommandOptionTypes, Bot, Interaction, MessageComponents } from "discordeno"
import { respond } from "modules"

export const cmd: ApplicationCommandOption = {
	name: "poll",
	description: "Make a poll [Unfinished]",
	type: ApplicationCommandOptionTypes.SubCommand,
}

export async function main(bot: Bot, interaction: Interaction) {
	const placeholders = [
		["Do you like pineapples on pizza?", "Yes", "No", "Why even?", "What the heck is a pineapple pizza"],
		["Where should we go to eat today", "McDonald's", "Burger King", "Taco Bell", "Wendy's"],
		["What's your favorite primary color?", "Red", "Green", "Green", "Yellow"],
	]
	const index = Math.floor(Math.random() * placeholders.length)

	const modalData: MessageComponents = []

	for (let i = 0; i < 5; i++) {
		modalData.push({
			type: 1,
			components: [{
				type: 4,
				label: i === 0 ? "Question" : `Option ${i}`,
				placeholder: placeholders[index][i],
				style: 1,
				minLength: 1,
				maxLength: i === 0 ? 500 : 100,
				customId: "Poll Question",
				required: i < 3,
			}],
		})
	}

	// await respond(bot, interaction, {
	//   title: "Create a Poll",
	//   customId: "poll",
	//   components: modalData
	// }, true)
	await respond(bot, interaction, "Poll is currently unavailable", true)
}

// export async function button(bot: Bot, interaction: Interaction) {
//   if (getCmdName(interaction) == "poll") {
//     const embed = interaction.message?.embeds[0]
//     // let user = embed.description?.split(" ").at(-1) as string
//     // user = user.slice(2, user.length - 1)
//     // switch(true) {
//     //   case interaction.customId.startsWith("poll"): {
//     //     switch(interaction.customId.slice(5)) {
//     //       case "close": {
//     //         console.log("close")
//     //         if (interaction.user.id == user) {await interaction.message.edit({ components: [] })}
//     //         else {await interaction.reply({ content: "You cannot close this poll", ephemeral: true })}
//     //         break
//     //       }
//     //     }
//     //     break
//     //   }
//     // }
//   }
// }

// export async function modal(bot: Bot, interaction: Interaction) {
//   //   const ques = interaction.options.getString("question")
//   //   const opt1 = interaction.options.getString("option1")
//   //   const opt2 = interaction.options.getString("option2")
//   //   const opt3 = interaction.options.getString("option3") || null
//   //   const opt4 = interaction.options.getString("option4") || null
//   //   const opt5 = interaction.options.getString("option5") || null

//   //   const split1 = splitBar(100, 0, 25)
//   //   const split2 = splitBar(100, 0, 25)

//   //   creation = new Date()
//   //   creation = (creation - creation.getMilliseconds()) / 1000

//   //   amount = Math.floor(Math.random() * 1000)

//   //   fields = [
//   //     { name: `${opt1.charAt(0).toUpperCase() + opt1.slice(1)} • 0/${amount} Votes • ${split1[1]}%`, value: `[${split1[0]}]`, inline: false },
//   //     { name: `${opt2.charAt(0).toUpperCase() + opt2.slice(1)} • 0/${amount} Votes • ${split2[1]}%`, value: `[${split2[0]}]`, inline: false },
//   //   ]

//   //   components = [
//   //     {
//   //       "type": 1,
//   //       "components": [
//   //         { "type": 2, "style": 2, "label": opt1, "custom_id": "poll_1_0" },
//   //         { "type": 2, "style": 2, "label": opt2, "custom_id": "poll_2_0" }
//   //       ]
//   //     },
//   //     {
//   //       "type": 1,
//   //       "components": [
//   //         { "type": 2, "style": 4, "label": "Close Poll", "custom_id": "poll_close" },
//   //       ]
//   //     }
//   //   ]

//   //   if (opt3) {
//   //     const split3 = splitBar(100, 0, 25)
//   //     fields.push({ name: `${opt3.charAt(0).toUpperCase() + opt3.slice(1)} • 0/${amount} Votes • ${split3[1]}%`, value: `[${split3[0]}]`, inline: false })
//   //     components[0].components.push({ "type": 2, "style": 2, "label": opt3, "custom_id": "poll_3_0" })
//   //   }

//   //   if (opt4) {
//   //     const split4 = splitBar(100, 0, 25)
//   //     fields.push({ name: `${opt4.charAt(0).toUpperCase() + opt4.slice(1)} • 0/${amount} Votes • ${split4[1]}%`, value: `[${split4[0]}]`, inline: false })
//   //     components[0].components.push({ "type": 2, "style": 2, "label": opt4, "custom_id": "poll_4_0" })
//   //   }

//   //   if (opt5) {
//   //     const split5 = splitBar(100, 0, 25)
//   //     fields.push({ name: `${opt5.charAt(0).toUpperCase() + opt5.slice(1)} • 0/${amount} Votes • ${split5[1]}%`, value: `[${split5[0]}]`, inline: false })
//   //     components[0].components.push({ "type": 2, "style": 2, "label": opt5, "custom_id": "poll_5_0" })
//   //   }

//   //   embed = {
//   //     title: `Poll - ${ques.charAt(0).toUpperCase() + ques.slice(1)}`,
//   //     color: parseInt(pickArray(colors), 16),
//   //     description: `0 votes so far\nPoll Created <t:${creation}:R> by <@${interaction.user.id}>`,
//   //     fields: fields,
//   //     footer: { text: "Last updated" },
//   //     timestamp: new Date().toISOString()
//   //   }

//   //   await interaction.reply({ embeds: [embed], components: components })
// }
