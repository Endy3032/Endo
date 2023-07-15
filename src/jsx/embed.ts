import { DiscordEmbed, DiscordEmbedField } from "discordeno"
import { colors, pickArray } from "modules"
import { Temporal } from "temporal"

type EmbedProps =
	& Omit<DiscordEmbed, "author" | "footer" | "image" | "thumbnail" | "fields" | "timestamp">
	& {
		image?: string
		thumbnail?: string
		authorName?: string
		authorIcon?: string
		authorUrl?: string
		footerText?: string
		footerIcon?: string
		timestamp?: number
	}

export function Embed(props: EmbedProps, children: DiscordEmbedField[]): DiscordEmbed {
	return {
		title: props.title,
		url: props.url,
		description: props.description,
		color: props.color ?? pickArray(colors),

		author: props.authorName ? { name: props.authorName, url: props.authorUrl, icon_url: props.authorIcon } : undefined,
		footer: props.footerText ? { text: props.footerText, icon_url: props.footerIcon } : undefined,
		image: props.image ? { url: props.image } : undefined,
		thumbnail: props.thumbnail ? { url: props.thumbnail } : undefined,

		fields: children.filter(e => !!e).slice(0, 25),
		timestamp: props.timestamp ? Temporal.Instant.fromEpochMilliseconds(props.timestamp).toString() : undefined,
	}
}

export function Field(props: DiscordEmbedField): DiscordEmbedField {
	return {
		name: props.name,
		value: props.value,
		inline: props.inline ?? false,
	}
}
