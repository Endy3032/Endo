import { DiscordEmbedField, Embed as EmbedComponent } from "discordeno"
import { colors, pickArray } from "modules"
import { Temporal } from "temporal"

type EmbedProps =
	& Omit<EmbedComponent, "author" | "footer" | "image" | "thumbnail" | "fields">
	& {
		image?: string
		thumbnail?: string
		authorName?: string
		authorIcon?: string
		authorUrl?: string
		footerText?: string
		footerIcon?: string
	}

export function Embed(props: EmbedProps, children: DiscordEmbedField[]): EmbedComponent {
	return {
		title: props.title,
		url: props.url,
		description: props.description,
		color: props.color ?? pickArray(colors),

		author: props.authorName ? { name: props.authorName, url: props.authorUrl, iconUrl: props.authorIcon } : undefined,
		footer: props.footerText ? { text: props.footerText, iconUrl: props.footerIcon } : undefined,
		image: props.image ? { url: props.image } : undefined,
		thumbnail: props.thumbnail ? { url: props.thumbnail } : undefined,

		fields: children,
		timestamp: props.timestamp ?? Temporal.Now.instant().epochMilliseconds,
	}
}

export function Field(props: DiscordEmbedField): DiscordEmbedField {
	return {
		name: props.name,
		value: props.value,
		inline: props.inline ?? false,
	}
}
