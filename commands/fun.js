const { colors } = require("../other/misc.js")
const { ApplicationCommandOptionType, ButtonStyle, ComponentType, MessageAttachment, TextInputStyle } = require("discord.js")

module.exports = {
  cmd: {
    name: "fun",
    description: "Random fun commands",
    options: [
      {
        name: "achievement",
        description: "Make your own Minecraft achievement",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "icon",
            description: "The icon of the achievement",
            type: ApplicationCommandOptionType.String,
            autocomplete: true,
            required: true
          },
          {
            name: "content",
            description: "The content of the achievement",
            type: ApplicationCommandOptionType.String,
            required: true
          },
          {
            name: "title",
            description: "The title of the achievement",
            type: ApplicationCommandOptionType.String,
            required: false
          }
        ]
      },
      {
        name: "facts",
        description: "Get a random fact",
        type: ApplicationCommandOptionType.Subcommand
      },
      {
        name: "format",
        description: "Reformat your text to any style from the list",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "style",
            description: "The style of the text",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
              { name: "vArIeD cAsE", value: "varied" },
              { name: "sᴍᴀʟʟ ᴄᴀᴘs", value: "smallcaps" },
              { name: "ᵗᶦⁿʸ ˢᵘᵖᵉʳˢᶜʳᶦᵖᵗ (tiny superscript)", value: "superscript" },
              { name: "uʍopǝpᴉsdn (upsidedown)", value: "upsidedown" },
              { name: "ｆｕｌｌｗｉｄｔｈ (fullwidth)", value: "fullwidth" },
              { name: "1337 (leet)", value: "leet" },
              { name: "丁卂尸卂ん乇丂乇 (japanese)", value: "japanese" }
            ]
          },
          {
            name: "text",
            description: "The text to be formatted [string]",
            type: ApplicationCommandOptionType.String,
            required: true
          }
        ]
      },
      {
        name: "meme",
        description: "Make your own meme",
        type: ApplicationCommandOptionType.SubcommandGroup,
        options: [
          {
            name: "mememan",
            description: "Make your own Mememan meme",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
              {
                name: "text",
                description: "The text to make the meme",
                type: ApplicationCommandOptionType.String,
                required: true
              },
              {
                name: "variant",
                description: "The variant of the mememan to use [Leave blank to pick random]",
                type: ApplicationCommandOptionType.String,
                autocomplete: true,
              }
            ]
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
  },

  async execute(interaction) {
    switch(interaction.options._group) {
      case "meme": {
        const fs = require("fs")
        const Canvas = require("canvas")
        const sizeOf = require("image-size")
        const canvasTxt = require("canvas-txt").default
        Canvas.registerFont("./Resources/Meme/Mememan/LeagueSpartan-Regular.ttf", { family: "LeagueSpartan" })

        await interaction.deferReply()

        const text = interaction.options.getString("text")
        const variants = fs.readdirSync("./Resources/Meme/Mememan/").filter((file) => file.endsWith(".png"))
        const variant = interaction.options.getString("variant") || variants[Math.floor(Math.random() * variants.length)].slice(0, -4)

        const dimensions = sizeOf(`./Resources/Meme/Mememan/${variant}.png`)
        const canvas = Canvas.createCanvas(dimensions.width, dimensions.height * 1.35)
        const ctx = canvas.getContext("2d")
        
        const offset = 0.4

        const bg = await Canvas.loadImage(`./Resources/Meme/Mememan/${variant}.png`)
        ctx.drawImage(bg, 0, dimensions.height * offset, dimensions.width, dimensions.height)

        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, dimensions.width, dimensions.height * offset)

        ctx.fillStyle = "#000000"
        canvasTxt.font = "LeagueSpartan"
        canvasTxt.fontSize = Math.min(dimensions.height * 0.13, dimensions.width * 0.09) * (0.975 ** Math.floor(text.length / 7.5))
        canvasTxt.drawText(ctx, text, 0, -(canvasTxt.fontSize / 2), dimensions.width, dimensions.height * offset + (canvasTxt.fontSize / 2))

        const attachment = new MessageAttachment(canvas.toBuffer(), "meme.png")
        await interaction.editReply({ files: [attachment], embeds: [{
          color: parseInt(colors[Math.floor(Math.random() * colors.length)], 16),
          image: { url: "attachment://meme.png" }
        }] })
        break
      }

      case "wordle": {
        const wordle = require("../other/wordle")
        var answer = ""

        ansi = {
          dark: "\u001b[0;40;37m",
          orange: "\u001b[0;41;37m",
          greyple: "\u001b[0;42;37m",
          blurple: "\u001b[0;45;37m",
          reset: "\u001b[0m"
        }

        switch (interaction.options._subcommand) {
          case "daily": {
            answer = wordle.getWord()
            title = "Daily Wordle"
            break
          }

          case "replay": {
            const id = interaction.options.getInteger("id")
            answer = wordle.answers[id]
            title = `Wordle #${id}`
            break
          }

          case "random": {
            const mode = interaction.options.getString("mode")
            if (mode == "random") {
              answer = wordle.allowed[Math.floor(Math.random() * wordle.allowed.length)]
              title = "Random Wordle"
            } else if (mode == "daily") {
              answer = wordle.answers[Math.floor(Math.random() * wordle.answers.length)]
              title = "Random Daily Wordle"
            }
            break
          }
        }

        embed = {
          title: `${title}`,
          timestamp: new Date().toISOString(),
          color: parseInt(colors[Math.floor(Math.random() * colors.length)], 16),
          footer: { text: "6 guesses remaining" },
          description: `<@${interaction.user.id}>'s Session\n\`\`\`ansi
  ${ansi.dark}   ${ansi.reset} ${ansi.dark}   ${ansi.reset} ${ansi.dark}   ${ansi.reset} ${ansi.dark}   ${ansi.reset} ${ansi.dark}   ${ansi.reset}
  ${ansi.dark}   ${ansi.reset} ${ansi.dark}   ${ansi.reset} ${ansi.dark}   ${ansi.reset} ${ansi.dark}   ${ansi.reset} ${ansi.dark}   ${ansi.reset}
  ${ansi.dark}   ${ansi.reset} ${ansi.dark}   ${ansi.reset} ${ansi.dark}   ${ansi.reset} ${ansi.dark}   ${ansi.reset} ${ansi.dark}   ${ansi.reset}
  ${ansi.dark}   ${ansi.reset} ${ansi.dark}   ${ansi.reset} ${ansi.dark}   ${ansi.reset} ${ansi.dark}   ${ansi.reset} ${ansi.dark}   ${ansi.reset}
  ${ansi.dark}   ${ansi.reset} ${ansi.dark}   ${ansi.reset} ${ansi.dark}   ${ansi.reset} ${ansi.dark}   ${ansi.reset} ${ansi.dark}   ${ansi.reset}
  ${ansi.dark}   ${ansi.reset} ${ansi.dark}   ${ansi.reset} ${ansi.dark}   ${ansi.reset} ${ansi.dark}   ${ansi.reset} ${ansi.dark}   ${ansi.reset}  

  ${ansi.dark}Q${ansi.reset} ${ansi.dark}W${ansi.reset} ${ansi.dark}E${ansi.reset} ${ansi.dark}R${ansi.reset} ${ansi.dark}T${ansi.reset} ${ansi.dark}Y${ansi.reset} ${ansi.dark}U${ansi.reset} ${ansi.dark}I${ansi.reset} ${ansi.dark}O${ansi.reset} ${ansi.dark}P${ansi.reset}
   ${ansi.dark}A${ansi.reset} ${ansi.dark}S${ansi.reset} ${ansi.dark}D${ansi.reset} ${ansi.dark}F${ansi.reset} ${ansi.dark}G${ansi.reset} ${ansi.dark}H${ansi.reset} ${ansi.dark}J${ansi.reset} ${ansi.dark}K${ansi.reset} ${ansi.dark}L${ansi.reset}
     ${ansi.dark}Z${ansi.reset} ${ansi.dark}X${ansi.reset} ${ansi.dark}C${ansi.reset} ${ansi.dark}V${ansi.reset} ${ansi.dark}B${ansi.reset} ${ansi.dark}N${ansi.reset} ${ansi.dark}M${ansi.reset}     
\`\`\``
        }

        components = [
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.Button,
                style: ButtonStyle.Primary,
                label: "Guess",
                custom_id: `wordle_${answer}`
              },
            ]
          }
        ]

        await interaction.reply({ embeds: [embed], components: components })
        break
      }

      default: {
        switch (interaction.options._subcommand) {
          case "achievement": {
            var titles = ["Achievement Get!", "Advancement Made!", "Goal Reached!", "Challenge Complete!"]

            content = interaction.options.getString("content")
            icon = interaction.options.getString("icon") !== "0" ? interaction.options.getString("icon") : Math.floor(Math.random() * 39)
            title = interaction.options.getString("title") !== null ? interaction.options.getString("title") : titles[Math.floor(Math.random() * titles.length)]

            achievementEmbed = {
              color: parseInt(colors[Math.floor(Math.random() * colors.length)], 16),
              image: { url: `https://minecraftskinstealer.com/achievement/${icon}/${encodeURI(title)}/${encodeURI(content)}` }
            }

            await interaction.reply({ embeds: [achievementEmbed] })
            break
          }

          case "facts": {
            const facts = [
              "The chicken came first or the egg? The answer is... `the chicken`",
              "The alphabet is completely random",
              "I ran out of facts. That's a fact",
              "Found this fact? You're lucky!",
              "There are 168 prime numbers between 1 and 1000",
              "`τ` is just `π` times two!",
              "`τ` is `tau` and `π` is `pi`!",
              "The F word is the most flexible word in English!",
              "`Homosapiens` are how biologists call humans!",
              "`Endy` is a cool bot! And that's a fact!",
              "`Long` is short and `short` is long!",
              "√-1 love you!",
              "There are 13 Slavic countries in the world -- Brought to you by your gopnik friend!",
              "There are plagues in 1620, 1720, 1820, 1920 and...",
              "The phrase: `The quick brown fox jumps over the lazy dog` contains every letter in the alphabet!",
              "There are no Nobel prizes for math because Nobel lost his love to a mathematician",
              "Endy is intellegent",
              "69 is just a normal number ok?",
              "There are 24 synthetic elements from 95~118",
              "Most of these facts are written by Adnagaporp#1965"
            ]

            factEmbed = {
              title: "Facts",
              color: parseInt(colors[Math.floor(Math.random() * colors.length)], 16),
              description: "Fresh out of the oven.",
              fields: [{ name: "The fact of the second is...", value: facts[Math.floor(Math.random() * facts.length)], inline: false }],
              authors: { name: `${interaction.user.username}#${interaction.user.discriminator}`, icon_url: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png` },
              footer: { text: `${interaction.client.user.username}#${interaction.client.user.discriminator}`, icon_url: `https://cdn.discordapp.com/avatars/${interaction.client.user.id}/${interaction.client.user.avatar}.png` }
            }

            await interaction.reply({ embeds: [factEmbed] })
            break
          }

          case "format": {
            // console.log(interaction.options)
            style = interaction.options.getString("style")
            text = interaction.options.getString("text")
            replacements = {
              og: " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZÁÀẢÃẠÉÈẺẼẸÍÌỈĨỊÓÒỎÕỌÚÙỦŨỤẮẰẲẴẶẤẦẨẪẬẾỀỂỄỆỐỒỔỖỘỚỜỞỠỢỨỪỬỮỰÝỲỶỸỴ[\\]^_`abcdefghijklmnopqrstuvwxyzáàảãạéèẻẽẹíìỉĩịóòỏõọúùủũụắằẳẵặấầẩẫậếềểễệốồổỗộớờởỡợứừửữựýỳỷỹỵ{|}",
              sc: " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZÁÀẢÃẠÉÈẺẼẸÍÌỈĨỊÓÒỎÕỌÚÙỦŨỤẮẰẲẴẶẤẦẨẪẬẾỀỂỄỆỐỒỔỖỘỚỜỞỠỢỨỪỬỮỰÝỲỶỸỴ[\\]^_`ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢáàảãạéèẻẽẹíìỉĩịóòỏõọúùủũụắằẳẵặấầẩẫậếềểễệốồổỗộớờởỡợứừửữựýỳỷỹỵ{|}",
              ss: " !\"#$%&'⁽⁾*⁺,⁻./⁰¹²³⁴⁵⁶⁷⁸⁹:;<⁼>?@ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁνᵂˣʸᶻÁÀẢÃẠÉÈẺẼẸÍÌỈĨỊÓÒỎÕỌÚÙỦŨỤẮẰẲẴẶẤẦẨẪẬẾỀỂỄỆỐỒỔỖỘỚỜỞỠỢỨỪỬỮỰÝỲỶỸỴ[\\]^_`ᵃᵇᶜᵈᵉᶠᵍʰᶦʲᵏˡᵐⁿᵒᵖᑫʳˢᵗᵘᵛʷˣʸᶻáàảãạéèẻẽẹíìỉĩịóòỏõọúùủũụắằẳẵặấầẩẫậếềểễệốồổỗộớờởỡợứừửữựýỳỷỹỵ{|}",
              ud: " ¡\"#$%℘,)(*+'-˙/0ƖᄅƐㄣϛ9ㄥ86:;>=<¿@∀qƆpƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMXλZÁÀẢÃẠÉÈẺẼẸÍÌỈĨỊÓÒỎÕỌÚÙỦŨỤẮẰẲẴẶẤẦẨẪẬẾỀỂỄỆỐỒỔỖỘỚỜỞỠỢỨỪỬỮỰÝỲỶỸỴ]\\[^‾,ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎzáàảãạéèẻẽẹíìỉĩịóòỏõọúùủũụắằẳẵặấầẩẫậếềểễệốồổỗộớờởỡợứừửữựýỳỷỹỵ}|{",
              fw: "　！＂＃＄％＆＇（）＊＋，－．／０１２３４５６７８９：；＜＝＞？＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺÁÀẢÃẠÉÈẺẼẸÍÌỈĨỊÓÒỎÕỌÚÙỦŨỤẮẰẲẴẶẤẦẨẪẬẾỀỂỄỆỐỒỔỖỘỚỜỞỠỢỨỪỬỮỰÝỲỶỸỴ［＼］＾＿｀ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚáàảãạéèẻẽẹíìỉĩịóòỏõọúùủũụắằẳẵặấầẩẫậếềểễệốồổỗộớờởỡợứừửữựýỳỷỹỵ｛｜｝",
              lt: " !\"#$%&'()*+,-./0123456789:;<=>?@48CD3FG#IJK1MN0PQЯ57UVWXY2ÁÀẢÃẠÉÈẺẼẸÍÌỈĨỊÓÒỎÕỌÚÙỦŨỤẮẰẲẴẶẤẦẨẪẬẾỀỂỄỆỐỒỔỖỘỚỜỞỠỢỨỪỬỮỰÝỲỶỸỴ[\\]^_`48cd3fg#ijk1mn0pqЯ57uvwxy2áàảãạéèẻẽẹíìỉĩịóòỏõọúùủũụắằẳẵặấầẩẫậếềểễệốồổỗộớờởỡợứừửữựýỳỷỹỵ{|}",
              jp: "　!\"#$%&'()*+,-./0123456789:;<=>?@卂乃匚刀乇下厶卄工丁长乚从ん口尸㔿尺丂丅凵リ山乂丫乙ÁÀẢÃẠÉÈẺẼẸÍÌỈĨỊÓÒỎÕỌÚÙỦŨỤẮẰẲẴẶẤẦẨẪẬẾỀỂỄỆỐỒỔỖỘỚỜỞỠỢỨỪỬỮỰÝỲỶỸỴ[\\]^_`卂乃匚刀乇下厶卄工丁长乚从ん口尸㔿尺丂丅凵リ山乂丫乙áàảãạéèẻẽẹíìỉĩịóòỏõọúùủũụắằẳẵặấầẩẫậếềểễệốồổỗộớờởỡợứừửữựýỳỷỹỵ{|}"
            }

            let replace, result

            switch(style) {
              case "varied": {
                turn = false
                for (i = 0; i < text.length; i++) {
                  if (text[i] == " ") {
                    result += " "
                    turn = !turn
                  } else {
                    cond = turn ? i % 2 == 0 : i % 2 !== 0
                    result += cond ? text[i].toUpperCase() : text[i].toLowerCase()
                  }
                }
                return await interaction.reply({ content: `**Original:** ${text}\n**Converted:** ${result}`, ephemeral: true })
              }

              case "smallcaps": {
                replace = replacements.sc
                break
              }

              case "superscript": {
                replace = replacements.ss
                break
              }

              case "upsidedown": {
                replace = replacements.ud
                break
              }

              case "fullwidth": {
                replace = replacements.fw
                break
              }

              case "leet": {
                replace = replacements.lt
                break
              }

              case "japanese": {
                replace = replacements.jp
                break
              }
            }

            for (i = 0; i < text.length; i++) {
              result += replace[replacements.og.indexOf(text[i])]
            }

            await interaction.reply({ content: `**Original:** ${text}\n**Converted:** ${result}`, ephemeral: true })
            break
          }
        }
      }
    }
  },

  async button(interaction) {
    if (interaction.customId.startsWith("wordle")) {
      if (!interaction.message.embeds[0].data.description.includes(interaction.user.id)) {return interaction.reply({ content: "You can't sabotage another player's Wordle session", ephemeral: true })}
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
  },

  async autocomplete(interaction) {
    const fs = require("fs")
    const Fuse = require("fuse.js")

    switch (interaction.options._subcommand) {
      case "achievement": {
        choices = [
          { name: "arrow",            value: "34" },
          { name: "bed",              value: "9"  },
          { name: "cake",             value: "10" },
          { name: "cobweb",           value: "16" },
          { name: "crafting_table",   value: "13" },
          { name: "creeper",          value: "4"  },
          { name: "diamond",          value: "2"  },
          { name: "diamond_sword",    value: "3"  },
          { name: "arrow",            value: "34" },
          { name: "book",             value: "19" },
          { name: "bow",              value: "33" },
          { name: "bucket",           value: "36" },
          { name: "chest",            value: "17" },
          { name: "coal_block",       value: "31" },
          { name: "cookie",           value: "7"  },
          { name: "diamond_armor",    value: "26" },
          { name: "fire",             value: "15" },
          { name: "flint_and_steel",  value: "27" },
          { name: "furnace",          value: "18" },
          { name: "gold_ingot",       value: "23" },
          { name: "grass_block",      value: "1"  },
          { name: "heart",            value: "8"  },
          { name: "iron_armor",       value: "35" },
          { name: "iron_door",        value: "25" },
          { name: "iron_ingot",       value: "22" },
          { name: "iron_sword",       value: "32" },
          { name: "lava",             value: "38" },
          { name: "milk",             value: "39" },
          { name: "oak_door",         value: "24" },
          { name: "pig",              value: "5"  },
          { name: "planks",           value: "21" },
          { name: "potion",           value: "28" },
          { name: "rail",             value: "12" },
          { name: "redstone",         value: "14" },
          { name: "sign",             value: "11" },
          { name: "spawn_egg",        value: "30" },
          { name: "splash",           value: "29" },
          { name: "stone",            value: "20" },
          { name: "tnt",              value: "6"  },
          { name: "water",            value: "37" },
        ]
        break
      }

      case "mememan": {
        choices = []
        const mememanFiles = fs.readdirSync("./Resources/Meme/Mememan/").filter(file => file.endsWith(".png"))
        mememanFiles.forEach(file => {
          choices.push({ name: file.split(".")[0].replaceAll("_", " "), value: file.split(".")[0] })
        })
        break
      }
    }

    res = [{ name: "random", value: "0" }]
    pattern = interaction.options.getFocused()
    const fuse = new Fuse(choices, { distance: 24, keys: ["name", "value"] })

    if (pattern.length > 0) {fuse.search(pattern).forEach(choice => res.push(choice.item))}
    else {
      for (i = 0; i < choices.length; i++) {
        if (i > 23) break
        res.push(choices[i])
      }
    }

    interaction.respond(res)
  },

  async modal(interaction) {
    const wordle = require("../other/wordle")
    const [guess, answer] = [interaction.fields.getTextInputValue("guess").toUpperCase(), interaction.message.components[0].components[0].data.custom_id.substring(7).toUpperCase()]
    var [embed, result] = [interaction.message.embeds[0], ""]
    let { description } = embed

    if (guess.length !== 5) return interaction.reply("Invalid word length!")
    if (!wordle.allowed.includes(guess.toLowerCase())) return interaction.reply({ content: `${guess} is not a valid word!`, ephemeral: true })

    ansi = {
      dark: "\u001b[0;40;37m",
      orange: "\u001b[0;41;37m",
      greyple: "\u001b[0;42;37m",
      blurple: "\u001b[0;45;37m",
      reset: "\u001b[0m",
    }
    ansi.blank = `${ansi.dark}   ${ansi.reset} ${ansi.dark}   ${ansi.reset} ${ansi.dark}   ${ansi.reset} ${ansi.dark}   ${ansi.reset} ${ansi.dark}   ${ansi.reset}`

    if (guess == answer) {
      embed.data.footer = null
      embed.data.title += " - You Won!"
      embed.data.description = description.replace(ansi.blank, `${ansi.blurple} ${guess[0]}   ${guess[1]}   ${guess[2]}   ${guess[3]}   ${guess[4]} ${ansi.reset}`.trim())
      return await interaction.update({ embeds: [embed], components: [] })
    }

    for (i = 0; i < guess.length; i++) {
      if (guess[i] === answer[i]) {
        result += `${ansi.blurple} ${guess[i]} ${ansi.reset} `
        description = description.replace(`${ansi.dark}${guess[i]}${ansi.reset}`, `${ansi.blurple}${guess[i]}${ansi.reset}`)
        description = description.replace(`${ansi.greyple}${guess[i]}${ansi.reset}`, `${ansi.blurple}${guess[i]}${ansi.reset}`)
      } else if (answer.includes(guess[i])) {
        result += `${ansi.greyple} ${guess[i]} ${ansi.reset} `
        description = description.replace(`${ansi.dark}${guess[i]}${ansi.reset}`, `${ansi.greyple}${guess[i]}${ansi.reset}`)
      } else {
        result += `${ansi.orange} ${guess[i]} ${ansi.reset} `
        description = description.replace(`${ansi.dark}${guess[i]}${ansi.reset}`, `${ansi.orange}${guess[i]}${ansi.reset}`)
      }
    }

    embed.data.footer.text = `${parseInt(embed.data.footer.text.charAt(0)) - 1} ${embed.data.footer.text.substring(2)}`
    embed.data.description = description.replace(ansi.blank, result.trim())
    if (embed.data.footer.text.charAt(0) == "0") {
      embed.data.footer = null
      embed.data.title += " - You Lost :("
      return await interaction.update({ embeds: [embed], components: [] })
    }
    await interaction.update({ embeds: [embed] })
  }
}

// module.exports.help = {
//   name: module.exports.data.name,
//   description: module.exports.data.description,
//   arguments: "<location>",
//   usage: '`/' + module.exports.data.name + ' <location>`'
// }

