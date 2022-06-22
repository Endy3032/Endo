import axios from "axios"
import Fuse from "fuse.js"
import { colors, pickFromArray, randRange } from "../Modules"
import { Temporal } from "@js-temporal/polyfill"
import { APIActionRowComponent, APIEmbed, APIMessageActionRowComponent } from "discord-api-types/v10"
import { ActionRow, ApplicationCommandOptionType, AutocompleteInteraction, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, ComponentType, Embed, EmbedBuilder, MessageActionRowComponent, MessageAttachment, ModalMessageModalSubmitInteraction, TextInputStyle } from "discord.js"

// #region Canvas Related Stuff
import fs from "fs"
import { imageSize } from "image-size"
import wordle from "../Resources/Wordle"
import { Canvas, CanvasRenderingContext2D, FontLibrary, loadImage } from "skia-canvas"

FontLibrary.use({
  LeagueSpartan: ["./Resources/Meme/LeagueSpartan-Regular.ttf"],
  ClearSans: ["./Resources/Wordle/ClearSans-Bold.ttf"]
})
// #endregion

function getCtx(canvas: Canvas) {
  const ctx = canvas.getContext("2d")
  ctx.textBaseline = "top"
  ctx.textAlign = "center"
  ctx.textWrap = true
  return ctx
}

function getFontSize(text: string, width: number, height: number) {
  return Math.min(height * 0.11, width * 0.09) * (0.975 ** Math.floor(text.length / 10))
}

function getMidY(ctx: CanvasRenderingContext2D, text: string, width: number, height: number) {
  const measurements = ctx.measureText(text, width)
  const textHeight = measurements.actualBoundingBoxDescent - measurements.actualBoundingBoxAscent
  return (height - textHeight) / 2
}

async function sendMeme(interaction: ChatInputCommandInteraction, canvas: Canvas, variant: string, text: string, separator: string) {
  const attachment = new MessageAttachment(await canvas.png, "meme.png")
  await interaction.editReply({ files: [attachment], embeds: [{
    color: parseInt(pickFromArray(colors), 16),
    image: { url: "attachment://meme.png" },
    footer: variant.includes("panik_kalm_panik") && text.split(separator).length < 3 ? { text: `Tip: Separate 3 texts with ${separator} to fill the whole template` } : null
  }] as APIEmbed[] })
}

export const cmd = {
  name: "fun",
  description: "Random fun commands",
  options: [
    {
      name: "meme",
      description: "Make your own meme",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "text",
          description: "The meme's caption",
          type: ApplicationCommandOptionType.String,
          required: true
        },
        {
          name: "variant",
          description: "The meme's variant (leave blank for random)",
          type: ApplicationCommandOptionType.String,
          autocomplete: true,
          required: false
        },
        {
          name: "custom_image",
          description: "Custom image (overrides variant)",
          type: ApplicationCommandOptionType.Attachment,
          required: false
        }
      ]
    },
    {
      name: "wordle",
      description: "Play a game of Wordle!",
      type: ApplicationCommandOptionType.SubcommandGroup,
      options: [
        {
          name: "daily",
          description: "Play today's word from Wordle",
          type: ApplicationCommandOptionType.Subcommand,
        },
        {
          name: "replay",
          description: "Replay a game of Worlde",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "id",
              description: "The ID of the game to replay [integer 0~2308]",
              type: ApplicationCommandOptionType.Integer,
              required: true,
              min_value: 0,
              max_value: 2308
            }
          ]
        },
        {
          name: "random",
          description: "Play any random word",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "mode",
              description: "The random mode to play",
              type: ApplicationCommandOptionType.String,
              required: true,
              choices: [
                { name: "Random Words", value: "random" },
                { name: "Random Daily Wordle", value: "daily" },
              ]
            }
          ]
        },
      ]
    },
  ]
}

export async function execute(interaction: ChatInputCommandInteraction) {
  let title = `${interaction.user.tag} | `
  let answer: string | undefined

  switch (interaction.options.getSubcommand()) {
    case "daily": {
      [answer, title] = [wordle.getWord(), `${title}Daily Wordle`]
      break
    }

    case "replay": {
      const id = interaction.options.getInteger("id") as number;
      [answer, title] = [wordle.answers[id], `${title}Wordle #${id}`]
      break
    }

    case "random": {
      const mode = interaction.options.getString("mode")
      title += "Random Wordle"
      answer = mode == "random"
        ? pickFromArray(wordle.allowed)
        : pickFromArray(wordle.answers)
      break
    }
  }

  const embed = {
    title,
    image: { url: "attachment://wordle.png" },
    footer: { text: "6 guesses remaining" },
    timestamp: Temporal.Now.instant().toString(),
  }

  const components: APIActionRowComponent<APIMessageActionRowComponent>[] = [{
    type: ComponentType.ActionRow,
    components: [
      {
        type: ComponentType.Button,
        style: ButtonStyle.Primary,
        label: "Guess",
        custom_id: `wordle_${(answer as string).toUpperCase()}__`
      },
      {
        type: ComponentType.Button,
        style: ButtonStyle.Danger,
        label: "Give Up",
        custom_id: `wordle_${(answer as string).toUpperCase()}_giveup`
      }
    ]
  }]

  const attachment = new MessageAttachment("./Resources/Wordle/WordleBase.png", "wordle.png")
  await interaction.reply({ embeds: [embed], components, files: [attachment] })
}

export async function button(interaction: ButtonInteraction) {
  if (interaction.customId.startsWith("wordle")) {
    const embed = new EmbedBuilder((interaction.message.embeds[0] as Embed).data).toJSON()

    if (!embed.title?.includes(interaction.user.tag)) return interaction.reply({ content: "You can't sabotage another player's Wordle session", ephemeral: true })
    if (interaction.customId.endsWith("giveup")) {
      return await interaction.update({ content: `**${interaction.user.tag} Gave Up!**\n**Answer:** ${interaction.customId.slice(7, 12)}`, components: [], embeds: [] })
    }

    await interaction.showModal({
      title: "Wordle",
      custom_id: "wordle",
      components: [{
        type: ComponentType.ActionRow,
        components: [{
          type: ComponentType.TextInput,
          custom_id: "guess",
          label: "Your Guess",
          style: TextInputStyle.Short,
          min_length: 5,
          max_length: 5,
          required: true
        }]
      }]
    })
  }
}

export async function modal(interaction: ModalMessageModalSubmitInteraction) {
  const [guess, answer] = [interaction.fields.getTextInputValue("guess").toUpperCase(), (interaction.message?.components as ActionRow<MessageActionRowComponent>[])[0].components[0].customId?.slice(7, 12) as string]
  if (guess.length != 5) return interaction.reply({ content: "Invalid word length!", ephemeral: true })
  if (!wordle.allowed.includes(guess.toLowerCase())) return interaction.reply({ content: `${guess} is not a valid word!`, ephemeral: true })

  const [embed, ansArray] = [new EmbedBuilder((interaction.message?.embeds[0] as Embed).data).toJSON(), answer.split("")]
  const { width, height, space, side, keyFont, tileFont, tileStartingX, tileStartingY, keyWidth, keyStartingY, keys } = wordle.canvas

  let buttonID = (interaction.message?.components as ActionRow<MessageActionRowComponent>[])[0].components[0].customId as string
  if (buttonID == `wordle_${answer}`) {buttonID = `wordle_${answer}__`}
  const buttonIDs = buttonID.split("_") as string[]

  const canvas = new Canvas(width, height)
  const ctx = getCtx(canvas)
  ctx.font = `normal ${tileFont}px ClearSans`

  const img = await loadImage(embed.image?.url as string)
  ctx.drawImage(img, 0, 0, width, height)

  const guessCount = Math.abs(parseInt(embed.footer?.text.charAt(0) as string) - 7)
  for (let i = 0; i < 5; i++) {
    if (guess[i] == answer[i] && ansArray.includes(guess[i])) {
      ctx.fillStyle = wordle.colors.correct
      ansArray.splice(ansArray.indexOf(guess[i]), 1)
      if (!buttonIDs[2].includes(guess[i])) {buttonIDs[2] += guess[i]}
      buttonIDs[3].replaceAll(guess[i], "")
    } else if (answer.includes(guess[i]) && ansArray.includes(guess[i])) {
      ctx.fillStyle = wordle.colors.present
      ansArray.splice(ansArray.indexOf(guess[i]), 1)
      if (!buttonIDs[2].includes(guess[i]) && !buttonIDs[3].includes(guess[i])) {buttonIDs[3] += guess[i]}
    } else {
      ctx.fillStyle = wordle.colors.absent
    }

    const tileX = tileStartingX + i * (side + space)
    const tileY = tileStartingY + (guessCount - 1) * (side + space)

    ctx.fillRect(tileX, tileY, side, side)

    if (ctx.fillStyle != wordle.colors.present && buttonIDs[3].includes(guess[i])) ctx.fillStyle = wordle.colors.present
    if (ctx.fillStyle != wordle.colors.correct && buttonIDs[2].includes(guess[i])) ctx.fillStyle = wordle.colors.correct

    let x: number | undefined
    var y = keys.findIndex((keyRow) => {
      x = keyRow.indexOf(guess[i])
      return x != -1
    })

    const keyStartingX = (width - (keyWidth * keys[y].length + space * (keys[y].length - 1)))/2
    const keyX = keyStartingX + (x as number) * (keyWidth + space)
    const keyY = keyStartingY + y * (side + space)

    ctx.fillRect(keyX, keyY, keyWidth, side)

    ctx.fillStyle = wordle.colors.text
    ctx.font = ctx.font = `normal ${tileFont}px ClearSans`
    ctx.fillText(guess[i], tileX + side / 2, tileY - tileFont / 8 + getMidY(ctx, guess[i], side, side))
    ctx.font = ctx.font = `normal ${keyFont}px ClearSans`
    ctx.fillText(guess[i], keyX + keyWidth / 2, keyY + getMidY(ctx, guess[i], keyWidth, side), keyWidth)
  }

  embed.footer = { text: `${6 - guessCount}${embed.footer?.text.slice(1)}` }
  embed.image = { url: `attachment://wordle${guessCount}.png` }
  const attachment = new MessageAttachment(await canvas.png, `wordle${guessCount}.png`)

  const components: APIActionRowComponent<APIMessageActionRowComponent>[] = [{
    type: ComponentType.ActionRow,
    components: [
      {
        type: ComponentType.Button,
        style: ButtonStyle.Primary,
        label: "Guess",
        custom_id: String(buttonIDs.join("_"))
      },
      {
        type: ComponentType.Button,
        style: ButtonStyle.Danger,
        label: "Give Up",
        custom_id: "wordle_giveup"
      }
    ]
  }]

  if (guess == answer) {
    embed.title += " - You Won!"
  } else if (embed.footer.text.charAt(0) == "0") {
    embed.title += " - You Lost :("
    embed.footer = { text: `Answer: ${answer}` }
  } else {
    return await interaction.update({ components: components, embeds: [embed], files: [attachment] })
  }
  await interaction.update({ components: [], embeds: [embed], files: [attachment] })
}
