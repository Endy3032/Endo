const partOfSpeech = [
	"noun",
	"verb",
	"adjective",
	"adverb",
	"determiner",
	"article",
	"preposition",
	"conjunction",
	"proper noun",
	"letter",
	"character",
	"phrase",
	"proverb",
	"idiom",
	"symbol",
	"syllable",
	"numeral",
	"initialism",
	"interjection",
	"definitions",
	"pronoun",
	"particle",
	"predicative",
	"participle",
	"suffix",
]

const relations = [
	"synonyms",
	"antonyms",
	"hypernyms",
	"hyponyms",
	"meronyms",
	"holonyms",
	"troponyms",
	"related terms",
	"coordinate terms",
]

const otherSections = [
	"alternative forms",
	"etymology",
	"pronunciation",
]

interface WikiLangLink {
	lang: string
	url: string
	langname: string
	autonym: string
	title: string
}

interface WikiSection {
	toclevel: number
	level: string
	line: string
	number: string
	index: string
	fromtitle: string
	byteoffset: number
	anchor: string
	linkAnchor: string
}

interface ParsedWiki {
	parse: {
		title: string
		pageid: number
		langlinks: WikiLangLink[]
		sections: WikiSection[]
		wikitext: {
			"*": string
		}
	}
}

export const getLanguages = (sections: WikiSection[]) => sections.filter(s => s.toclevel === 1 && s.line !== "References")

export const getSections = (language: string, sections: WikiSection[]) => {
	const langInd = sections.findIndex(s => s.line === language)
	const nextLangInd = sections.findIndex((s, i) => i > langInd && s.toclevel === 1)

	return sections.slice(langInd, nextLangInd === -1 ? undefined : nextLangInd)
}

export function formatAlternativeForms(text: string, sections?: WikiSection[], language = "English") {
	const lang = sections?.find(s => s.line === language)
	const alterInd = sections?.findIndex(s => s.line === "Alternative forms" && s.number.startsWith(lang?.number ?? "1"))
	if (alterInd) text = text.slice(sections?.[alterInd].byteoffset, sections?.[alterInd + 1]?.byteoffset ?? undefined)

	const nestedAltRE = /{{[^|{]*\|[^|{]*\|[^|{]*\|([^|}]*)}}/g,
		altRE = /{{[^|{]*\|[^|{]*\|([^}]*)\|\|([^|{]*)\}}/g,
		noAltRE = /{{[^|]*\|[^|]*\|([^|]*)}}/g

	return text
		.replaceAll(nestedAltRE, "$1")
		.replaceAll(altRE, "$1 ($2)")
		.replaceAll(noAltRE, "$1")
		.replaceAll("|", ", ")
		.trim()
}

/**
 * .-------------------------.
 * |                         |
 * |         Message         |
 * |                         |
 * |-------------------------|
 * | Wiktionary Language   v |
 * |-------------------------|
 * | Languages             v |
 * |-------------------------|
 * | Sections              v |
 * ˚-------------------------˚
 */
