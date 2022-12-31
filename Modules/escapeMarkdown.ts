// Source https://github.com/discordjs/discord.js/blob/main/packages/discord.js/src/util/Util.js#L75
export const escapeMarkdown = (text: string) =>
	text
		// Codeblocks
		.replaceAll("`", "\\`")
		// Bold, Italic & Underline
		.replaceAll("*", "\\*")
		.replaceAll("_", "\\_")
		// Strikethrough
		.replaceAll("~~", "\\~\\~")
		// Spoiler
		.replaceAll("||", "\\|\\|")
		// Heading
		.replaceAll(/^( {0,2}[*-] +)?(#{1,3} )/gm, "$1\\$2")
		// Bulleted List
		.replaceAll(/^( *)[*-]( +)/gm, "$1\\-$2")
		// Numbered List
		.replaceAll(/^( *\d+)\./gm, "$1\\.")
		// Masked Link
		.replaceAll(/\[.+\]\(.+\)/gm, "\\$&")
		// Timestamp
		.replaceAll("<t:", "\\<t:")
