import { DiscordEmbed, Interaction } from "discordeno"
import { Embed } from "jsx"
import { Args, capitalize, colors, pickArray } from "modules"

interface Source {
	name: string
	url?: string
	icon?: string
}

export async function respond(interaction: Interaction, args: Args, fact?: string, source?: Source) {
	const embed: DiscordEmbed = (
		<Embed
			title={`${capitalize(args.subcommand)} Fact`}
			authorName={source?.name}
			authorUrl={source?.url}
			authorIcon={source?.icon ?? "https://github.com/fluidicon.png"}
			description={fact ?? "Wow, such empty!"}
		/>
	)

	await interaction.respond({ embeds: [embed] })
}
