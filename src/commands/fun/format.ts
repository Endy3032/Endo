import { ApplicationCommandOption, ApplicationCommandOptionTypes, Bot, Interaction } from "discordeno"
import { getValue, respond } from "modules"

export const cmd: ApplicationCommandOption = {
	name: "format",
	description: "Reformat your text to any style from the list",
	type: ApplicationCommandOptionTypes.SubCommand,
	options: [
		{
			name: "style",
			description: "The style of the text",
			type: ApplicationCommandOptionTypes.String,
			choices: [
				{ name: "vArIeD cAsE", value: "varied" },
				{ name: "sᴍᴀʟʟ ᴄᴀᴘs", value: "smallcaps" },
				{ name: "ᵗᶦⁿʸ ˢᵘᵖᵉʳˢᶜʳᶦᵖᵗ (tiny superscript)", value: "superscript" },
				{ name: "uʍopǝpᴉsdn (upsidedown)", value: "upsidedown" },
				{ name: "ｆｕｌｌｗｉｄｔｈ (fullwidth)", value: "fullwidth" },
				{ name: "1337 (leet)", value: "leet" },
				{ name: "丁卂尸卂ん乇丂乇 (japanese)", value: "japanese" },
			],
			required: true,
		},
		{
			name: "text",
			description: "The text to be formatted [String]",
			type: ApplicationCommandOptionTypes.String,
			required: true,
		},
	],
}

export async function main(bot: Bot, interaction: Interaction) {
	const style = getValue(interaction, "style", "String") ?? "og"
	const text = getValue(interaction, "text", "String") ?? ""

	const replacements = {
		og:
			" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZÁÀẢÃẠÉÈẺẼẸÍÌỈĨỊÓÒỎÕỌÚÙỦŨỤẮẰẲẴẶẤẦẨẪẬẾỀỂỄỆỐỒỔỖỘỚỜỞỠỢỨỪỬỮỰÝỲỶỸỴ[\\]^_`abcdefghijklmnopqrstuvwxyzáàảãạéèẻẽẹíìỉĩịóòỏõọúùủũụắằẳẵặấầẩẫậếềểễệốồổỗộớờởỡợứừửữựýỳỷỹỵ{|}",
		smallcaps:
			" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZÁÀẢÃẠÉÈẺẼẸÍÌỈĨỊÓÒỎÕỌÚÙỦŨỤẮẰẲẴẶẤẦẨẪẬẾỀỂỄỆỐỒỔỖỘỚỜỞỠỢỨỪỬỮỰÝỲỶỸỴ[\\]^_`ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢáàảãạéèẻẽẹíìỉĩịóòỏõọúùủũụắằẳẵặấầẩẫậếềểễệốồổỗộớờởỡợứừửữựýỳỷỹỵ{|}",
		superscript:
			" !\"#$%&'⁽⁾*⁺,⁻./⁰¹²³⁴⁵⁶⁷⁸⁹:;<⁼>?@ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁνᵂˣʸᶻÁÀẢÃẠÉÈẺẼẸÍÌỈĨỊÓÒỎÕỌÚÙỦŨỤẮẰẲẴẶẤẦẨẪẬẾỀỂỄỆỐỒỔỖỘỚỜỞỠỢỨỪỬỮỰÝỲỶỸỴ[\\]^_`ᵃᵇᶜᵈᵉᶠᵍʰᶦʲᵏˡᵐⁿᵒᵖᑫʳˢᵗᵘᵛʷˣʸᶻáàảãạéèẻẽẹíìỉĩịóòỏõọúùủũụắằẳẵặấầẩẫậếềểễệốồổỗộớờởỡợứừửữựýỳỷỹỵ{|}",
		upsidedown:
			" ¡\"#$%℘,)(*+'-˙/0ƖᄅƐㄣϛ9ㄥ86:;>=<¿@∀qƆpƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMXλZÁÀẢÃẠÉÈẺẼẸÍÌỈĨỊÓÒỎÕỌÚÙỦŨỤẮẰẲẴẶẤẦẨẪẬẾỀỂỄỆỐỒỔỖỘỚỜỞỠỢỨỪỬỮỰÝỲỶỸỴ]\\[^‾,ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎzáàảãạéèẻẽẹíìỉĩịóòỏõọúùủũụắằẳẵặấầẩẫậếềểễệốồổỗộớờởỡợứừửữựýỳỷỹỵ}|{",
		fullwidth:
			"　！＂＃＄％＆＇（）＊＋，－．／０１２３４５６７８９：；＜＝＞？＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺÁÀẢÃẠÉÈẺẼẸÍÌỈĨỊÓÒỎÕỌÚÙỦŨỤẮẰẲẴẶẤẦẨẪẬẾỀỂỄỆỐỒỔỖỘỚỜỞỠỢỨỪỬỮỰÝỲỶỸỴ［＼］＾＿｀ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚáàảãạéèẻẽẹíìỉĩịóòỏõọúùủũụắằẳẵặấầẩẫậếềểễệốồổỗộớờởỡợứừửữựýỳỷỹỵ｛｜｝",
		leet:
			" !\"#$%&'()*+,-./0123456789:;<=>?@48CD3FG#IJK1MN0PQЯ57UVWXY2ÁÀẢÃẠÉÈẺẼẸÍÌỈĨỊÓÒỎÕỌÚÙỦŨỤẮẰẲẴẶẤẦẨẪẬẾỀỂỄỆỐỒỔỖỘỚỜỞỠỢỨỪỬỮỰÝỲỶỸỴ[\\]^_`48cd3fg#ijk1mn0pqЯ57uvwxy2áàảãạéèẻẽẹíìỉĩịóòỏõọúùủũụắằẳẵặấầẩẫậếềểễệốồổỗộớờởỡợứừửữựýỳỷỹỵ{|}",
		japanese:
			"　!\"#$%&'()*+,-./0123456789:;<=>?@卂乃匚刀乇下厶卄工丁长乚从ん口尸㔿尺丂丅凵リ山乂丫乙ÁÀẢÃẠÉÈẺẼẸÍÌỈĨỊÓÒỎÕỌÚÙỦŨỤẮẰẲẴẶẤẦẨẪẬẾỀỂỄỆỐỒỔỖỘỚỜỞỠỢỨỪỬỮỰÝỲỶỸỴ[\\]^_`卂乃匚刀乇下厶卄工丁长乚从ん口尸㔿尺丂丅凵リ山乂丫乙áàảãạéèẻẽẹíìỉĩịóòỏõọúùủũụắằẳẵặấầẩẫậếềểễệốồổỗộớờởỡợứừửữựýỳỷỹỵ{|}",
	}

	let replace = ""
	let result = ""

	switch (style) {
		case "varied": {
			let turn = false
			for (let i = 0; i < text.length; i++) {
				if (text[i] != " ") {
					result += turn && i % 2 == 0 ? text[i].toUpperCase() : text[i].toLowerCase()
					continue
				}
				result += " "
				turn = !turn
			}
			return await respond(bot, interaction, `**Original:** ${text}\n**Converted:** ${result}`, true)
		}

		default: {
			replace = replacements[style]
			break
		}
	}

	for (let i = 0; i < text.length; i++) {
		result += replace.charAt(replacements.og.indexOf(text[i]))
	}

	await respond(bot, interaction, `**Original:** ${text}\n**Converted:** ${result}`, true)
}
