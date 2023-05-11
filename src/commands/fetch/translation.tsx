import { ApplicationCommandOptionChoice, ApplicationCommandOptionTypes, delay, DiscordEmbed, FileContent } from "discordeno"
import Fuse from "fuse"
import { GTR } from "googleTranslate"
import { Embed, Field } from "jsx"
import { AutocompleteHandler, InteractionHandler, ReadonlyOption } from "modules"
import { Blob as NBlob } from "node:buffer"

export const cmd = {
	name: "translation",
	description: "Translate a piece of text",
	type: ApplicationCommandOptionTypes.SubCommand,
	options: [
		{
			name: "to",
			description: "The translated language",
			type: ApplicationCommandOptionTypes.String,
			autocomplete: true,
			required: true,
		},
		{
			name: "text",
			description: "The text to translate",
			type: ApplicationCommandOptionTypes.String,
			required: true,
		},
		{
			name: "from",
			description: "The source language",
			type: ApplicationCommandOptionTypes.String,
			autocomplete: true,
			required: false,
		},
		{
			name: "tts",
			description: "Send an audio file for the translation",
			type: ApplicationCommandOptionTypes.String,
			choices: [
				{ name: "Source only", value: "source" },
				{ name: "Result only", value: "result" },
				{ name: "Both", value: "both" },
			],
			required: false,
		},
	],
} as const satisfies ReadonlyOption

const gtr = new GTR()

export const main: InteractionHandler<typeof cmd.options> = async (bot, interaction, args) => {
	await interaction.defer()

	const { from, to, text, tts } = args
	const result = await gtr.translate(text, { sourceLang: from, targetLang: to })

	const embed: DiscordEmbed = (
		<Embed title="Translate">
			<Field name={langs[result.lang]} value={result.orig} />
			<Field name={langs[to]} value={result.trans} />
		</Embed>
	)

	await interaction.edit({ content: tts ? "Audio pending..." : undefined, embeds: [embed] })

	if (tts) {
		const files: FileContent[] = []

		await delay(3000)
		if (["source", "both"].includes(tts)) {
			const audio = await gtr.tts(result.orig, { targetLang: result.lang })
			files.push({
				name: "source.mp3",
				blob: new NBlob([await audio.text()]),
			})
		}

		await delay(3000)
		if (["result", "both"].includes(tts)) {
			const audio = await gtr.tts(result.trans, { targetLang: to })
			files.push({
				name: "result.mp3",
				blob: new NBlob([await audio.text()]),
			})
		}

		await interaction.edit({ content: "", files })
	}
}

const langs = {
	auto: "Automatic",
	af: "Afrikaans",
	sq: "Albanian",
	am: "Amharic",
	ar: "Arabic",
	hy: "Armenian",
	//
	//
	az: "Azerbaijani",
	//
	eu: "Basque",
	be: "Belarusian",
	bn: "Bengali",
	//
	bs: "Bosnian",
	bg: "Bulgarian",
	ca: "Catalan",
	ceb: "Cebuano",
	ny: "Chichewa",
	"zh-cn": "Chinese Simplified",
	"zh-tw": "Chinese Traditional",
	co: "Corsican",
	hr: "Croatian",
	cs: "Czech",
	da: "Danish",
	//
	//
	nl: "Dutch",
	en: "English",
	eo: "Esperanto",
	et: "Estonian",
	//
	tl: "Filipino",
	fi: "Finnish",
	fr: "French",
	fy: "Frisian",
	gl: "Galician",
	ka: "Georgian",
	de: "German",
	el: "Greek",
	//
	gu: "Gujarati",
	ht: "Haitian Creole",
	ha: "Hausa",
	haw: "Hawaiian",
	iw: "Hebrew",
	hi: "Hindi",
	hmn: "Hmong",
	hu: "Hungarian",
	is: "Icelandic",
	ig: "Igbo",
	//
	id: "Indonesian",
	ga: "Irish",
	it: "Italian",
	ja: "Japanese",
	jw: "Javanese",
	kn: "Kannada",
	kk: "Kazakh",
	km: "Khmer",
	//
	//
	ko: "Korean",
	//
	ku: "Kurdish (Kurmanji)",
	//
	ky: "Kyrgyz",
	lo: "Lao",
	la: "Latin",
	lv: "Latvian",
	//
	lt: "Lithuanian",
	//
	lb: "Luxembourgish",
	mk: "Macedonian",
	//
	mg: "Malagasy",
	ms: "Malay",
	ml: "Malayalam",
	mt: "Maltese",
	mi: "Maori",
	mr: "Marathi",
	//
	//
	mn: "Mongolian",
	my: "Myanmar (Burmese)",
	ne: "Nepali",
	no: "Norwegian",
	//
	//
	ps: "Pashto",
	fa: "Persian",
	pl: "Polish",
	pt: "Portuguese",
	ma: "Punjabi",
	//
	ro: "Romanian",
	ru: "Russian",
	sm: "Samoan",
	//
	gd: "Scots Gaelic",
	//
	sr: "Serbian",
	st: "Sesotho",
	sn: "Shona",
	sd: "Sindhi",
	si: "Sinhala",
	sk: "Slovak",
	sl: "Slovenian",
	so: "Somali",
	es: "Spanish",
	su: "Sundanese",
	sw: "Swahili",
	sv: "Swedish",
	tg: "Tajik",
	ta: "Tamil",
	te: "Telugu",
	th: "Thai",
	//
	//
	tr: "Turkish",
	//
	//
	uk: "Ukrainian",
	ur: "Urdu",
	//
	uz: "Uzbek",
	vi: "Vietnamese",
	cy: "Welsh",
	xh: "Xhosa",
	yi: "Yiddish",
	yo: "Yoruba",
	zu: "Zulu",
}

const langChoices: ApplicationCommandOptionChoice[] = Object.entries(langs).map(([k, v]) => ({ name: v, value: k }))

export const autocomplete: AutocompleteHandler<typeof cmd.options> = async (_, interaction, args) => {
	const response: ApplicationCommandOptionChoice[] = []
	const { focused: { value } } = args
	const fuse = new Fuse(langChoices, { keys: ["name", "value"] })

	response.push(
		...fuse
			.search(value.toString(), { limit: 25 })
			.map(r => ({ name: r.item.name, value: r.item.value })),
	)

	if (response.length === 0) response.push(...langChoices.slice(0, 25))

	await interaction.respond({ choices: response })
}
