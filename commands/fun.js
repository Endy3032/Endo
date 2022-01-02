const { MessageEmbed } = require('discord.js')

module.exports = {
  cmd: {
    name: "fun",
    description: "Random fun commands",
    options: [
      {
        name: "achievement",
        description: "Make your own Minecraft achievement",
        type: 2,
        options: [
          {
            name: "icon_pack_1",
            description: "Make your own Minecraft achievement [Icon Pack #1]",
            type: 1,
            options: [
              {
                name: "icon",
                description: "The icon for the achievement",
                type: 3,
                required: true,
                choices: [
                  { name: "random",          value: "0"  },
                  { name: "grass_block",     value: "1"  },
                  { name: "diamond",         value: "2"  },
                  { name: "diamond_sword",   value: "3"  },
                  { name: "creeper",         value: "4"  },
                  { name: "pig",             value: "5"  },
                  { name: "tnt",             value: "6"  },
                  { name: "cookie",          value: "7"  },
                  { name: "heart",           value: "8"  },
                  { name: "bed",             value: "9"  },
                  { name: "cake",            value: "10" },
                  { name: "sign",            value: "11" },
                  { name: "rail",            value: "12" },
                  { name: "crafting_table",  value: "13" },
                  { name: "redstone",        value: "14" },
                  { name: "fire",            value: "15" },
                  { name: "cobweb",          value: "16" },
                  { name: "chest",           value: "17" },
                  { name: "furnace",         value: "18" },
                  { name: "book",            value: "19" },
                  { name: "stone",           value: "20" }
                ]
              },
              {
                name: "content",
                description: "The content of the achievement",
                type: 3,
                required: true
              },
              {
                name: "title",
                description: "The title of the achievement",
                type: 3,
                required: false
              }
            ]
          },
          {
            name: "icon_pack_2",
            description: "Make your own Minecraft achievement [Icon Pack #2]",
            type: 1,
            options: [
              {
                name: "icon",
                description: "The icon for the achievement",
                type: 3,
                required: true,
                choices: [
                  { name: "random",           value: "0"  },
                  { name: "planks",           value: "21" },
                  { name: "iron_ingot",       value: "22" },
                  { name: "gold_ingot",       value: "23" },
                  { name: "oak_door",         value: "24" },
                  { name: "iron_door",        value: "25" },
                  { name: "diamond_armor",    value: "26" },
                  { name: "flint_and_steel",  value: "27" },
                  { name: "potion",           value: "28" },
                  { name: "splash",           value: "29" },
                  { name: "spawn_egg",        value: "30" },
                  { name: "coal_block",       value: "31" },
                  { name: "iron_sword",       value: "32" },
                  { name: "bow",              value: "33" },
                  { name: "arrow",            value: "34" },
                  { name: "iron_armor",       value: "35" },
                  { name: "bucket",           value: "36" },
                  { name: "water",            value: "37" },
                  { name: "lava",             value: "38" },
                  { name: "milk",             value: "39" }
                ]
              },
              {
                name: "content",
                description: "The content of the achievement",
                type: 3,
                required: true
              },
              {
                name: "title",
                description: "The title of the achievement",
                type: 3,
                required: false
              }
            ]
          }
        ]
      },
      {
        name: "format",
        description: "Reformat your text to any style from the list",
        type: 2,
        options: [
          {
            name: "varied",
            description: "mAkE y0uR tExT uSeS vArIEd CaSeS",
            type: 1,
            options: [
              {
                name: "text",
                description: "The text to be formatted [string]",
                type: 3,
                required: true
              }
            ]
          },
          {
            name: "smallcaps",
            description: "Mᴀᴋᴇ ʏᴏᴜʀ ᴛᴇxᴛ ᴜsᴇ sᴍᴀʟʟ ᴄᴀᴘs",
            type: 1,
            options: [
              {
                name: "text",
                description: "The text to be formatted [string]",
                type: 3,
                required: true
              }
            ]
          },
          {
            name: "superscript",
            description: "ᵐᵃᵏᵉ ʸᵒᵘʳ ᵗᵉˣᵗ ᵗᶦⁿʸ (make your text tiny)",
            type: 1,
            options: [
              {
                name: "text",
                description: "The text to be formatted [string]",
                type: 3,
                required: true
              }
            ]
          },
          {
            name: "upsidedown",
            description: "uʍopǝpᴉsdn ʇxǝʇ ɹnoʎ uɹnʇ (turn your text upsidedown)",
            type: 1,
            options: [
              {
                name: "text",
                description: "The text to be formatted [string]",
                type: 3,
                required: true
              }
            ]
          },
          {
            name: "fullwidth",
            description: "Ｍａｋｅ　ｙｏｕｒ　ｔｅｘｔ　ｆｕｌｌ　ｗｉｄｔｈ",
            type: 1,
            options: [
              {
                name: "text",
                description: "The text to be formatted [string]",
                type: 3,
                required: true
              }
            ]
          },
          {
            name: "leet",
            description: "1337ify y0uЯ 73x7 (leetify your text)",
            type: 1,
            options: [
              {
                name: "text",
                description: "The text to be formatted [string]",
                type: 3,
                required: true
              }
            ]
          },
          {
            name: "japanese",
            description: "从卂长乇　丫口凵尺　丅乇乂丅　乚口口长丂　乚工长乇　丁卂尸卂ん乇丂乇 (make your text looks like japanese)",
            type: 1,
            options: [
              {
                name: "text",
                description: "The text to be formatted [string]",
                type: 3,
                required: true
              }
            ]
          },
        ]
      },
      {
        name: "facts",
        description: "Get a random fact",
        type: 1
      }
    ]
  },

  async execute(interaction) {
    switch(interaction.options._group) {
      case 'achievement': {
        var defaultTitle = ['Achievement Get!', 'Advancement Made!', 'Goal Reached!', 'Challenge Complete!']

        interaction.options.getString('icon') !== '0' ? icon = interaction.options.getString('icon') : icon = Math.floor(Math.random() * 39)
        content = interaction.options.getString('content')
        interaction.options.getString('title') !== null ? title = interaction.options.getString('title') : title = defaultTitle[Math.floor(Math.random() * defaultTitle.length)]
        
        achievementEmbed = new MessageEmbed()
        .setImage(`https://minecraftskinstealer.com/achievement/${icon}/${encodeURI(title)}/${encodeURI(content)}`)
        .setColor('#2f3136')

        await interaction.reply({embeds: [achievementEmbed]})
        break
      }

      case 'format': {
        text = interaction.options.getString('text')
        result = ''
        og = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZÁÀẢÃẠÉÈẺẼẸÍÌỈĨỊÓÒỎÕỌÚÙỦŨỤẮẰẲẴẶẤẦẨẪẬẾỀỂỄỆỐỒỔỖỘỚỜỞỠỢỨỪỬỮỰÝỲỶỸỴ[\\]^_`abcdefghijklmnopqrstuvwxyzáàảãạéèẻẽẹíìỉĩịóòỏõọúùủũụắằẳẵặấầẩẫậếềểễệốồổỗộớờởỡợứừửữựýỳỷỹỵ{|}";
        sc = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZÁÀẢÃẠÉÈẺẼẸÍÌỈĨỊÓÒỎÕỌÚÙỦŨỤẮẰẲẴẶẤẦẨẪẬẾỀỂỄỆỐỒỔỖỘỚỜỞỠỢỨỪỬỮỰÝỲỶỸỴ[\\]^_`ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢáàảãạéèẻẽẹíìỉĩịóòỏõọúùủũụắằẳẵặấầẩẫậếềểễệốồổỗộớờởỡợứừửữựýỳỷỹỵ{|}";
        ss = " !\"#$%&'⁽⁾*⁺,⁻./⁰¹²³⁴⁵⁶⁷⁸⁹:;<⁼>?@ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁνᵂˣʸᶻÁÀẢÃẠÉÈẺẼẸÍÌỈĨỊÓÒỎÕỌÚÙỦŨỤẮẰẲẴẶẤẦẨẪẬẾỀỂỄỆỐỒỔỖỘỚỜỞỠỢỨỪỬỮỰÝỲỶỸỴ[\\]^_`ᵃᵇᶜᵈᵉᶠᵍʰᶦʲᵏˡᵐⁿᵒᵖᑫʳˢᵗᵘᵛʷˣʸᶻáàảãạéèẻẽẹíìỉĩịóòỏõọúùủũụắằẳẵặấầẩẫậếềểễệốồổỗộớờởỡợứừửữựýỳỷỹỵ{|}";
        ud = " ¡\"#$%℘,)(*+'-˙/0ƖᄅƐㄣϛ9ㄥ86:;>=<¿@∀qƆpƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMXλZÁÀẢÃẠÉÈẺẼẸÍÌỈĨỊÓÒỎÕỌÚÙỦŨỤẮẰẲẴẶẤẦẨẪẬẾỀỂỄỆỐỒỔỖỘỚỜỞỠỢỨỪỬỮỰÝỲỶỸỴ]\\[^‾,ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎzáàảãạéèẻẽẹíìỉĩịóòỏõọúùủũụắằẳẵặấầẩẫậếềểễệốồổỗộớờởỡợứừửữựýỳỷỹỵ}|{";
        fw = "　！＂＃＄％＆＇（）＊＋，－．／０１２３４５６７８９：；＜＝＞？＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺÁÀẢÃẠÉÈẺẼẸÍÌỈĨỊÓÒỎÕỌÚÙỦŨỤẮẰẲẴẶẤẦẨẪẬẾỀỂỄỆỐỒỔỖỘỚỜỞỠỢỨỪỬỮỰÝỲỶỸỴ［＼］＾＿｀ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚáàảãạéèẻẽẹíìỉĩịóòỏõọúùủũụắằẳẵặấầẩẫậếềểễệốồổỗộớờởỡợứừửữựýỳỷỹỵ｛｜｝";
        lt = " !\"#$%&'()*+,-./0123456789:;<=>?@48CD3FG#IJK1MN0PQЯ57UVWXY2ÁÀẢÃẠÉÈẺẼẸÍÌỈĨỊÓÒỎÕỌÚÙỦŨỤẮẰẲẴẶẤẦẨẪẬẾỀỂỄỆỐỒỔỖỘỚỜỞỠỢỨỪỬỮỰÝỲỶỸỴ[\\]^_`48cd3fg#ijk1mn0pqЯ57uvwxy2áàảãạéèẻẽẹíìỉĩịóòỏõọúùủũụắằẳẵặấầẩẫậếềểễệốồổỗộớờởỡợứừửữựýỳỷỹỵ{|}";
        jp = "　!\"#$%&'()*+,-./0123456789:;<=>?@卂乃匚刀乇下厶卄工丁长乚从ん口尸㔿尺丂丅凵リ山乂丫乙ÁÀẢÃẠÉÈẺẼẸÍÌỈĨỊÓÒỎÕỌÚÙỦŨỤẮẰẲẴẶẤẦẨẪẬẾỀỂỄỆỐỒỔỖỘỚỜỞỠỢỨỪỬỮỰÝỲỶỸỴ[\\]^_`卂乃匚刀乇下厶卄工丁长乚从ん口尸㔿尺丂丅凵リ山乂丫乙áàảãạéèẻẽẹíìỉĩịóòỏõọúùủũụắằẳẵặấầẩẫậếềểễệốồổỗộớờởỡợứừửữựýỳỷỹỵ{|}";

        switch(interaction.options._subcommand) {
          case 'varied': {
            turn = false
            for (i = 0; i < text.length; i++) {
              if (text[i] == ' ') {
                result += ' '
                turn = !turn
              } else {
                turn ? cond = i % 2 == 0 : cond = i % 2 !== 0
                cond ? result += text[i].toUpperCase() : result += text[i].toLowerCase()
              }
            }
            break
          }

          case 'smallcaps': {
            for (i = 0; i < text.length; i++) {
              result += sc[og.indexOf(text[i])]
            }
            break
          }

          case 'superscript': {
            for (i = 0; i < text.length; i++) {
              result += ss[og.indexOf(text[i])]
            }
            break
          }

          case 'upsidedown': {
            for (i = 0; i < text.length; i++) {
              result += ud[og.indexOf(text[i])]
            }
            break
          }
          
          case 'fullwidth': {
            for (i = 0; i < text.length; i++) {
              result += fw[og.indexOf(text[i])]
            }
            break
          }
          
          case 'leet': {
            for (i = 0; i < text.length; i++) {
              result += lt[og.indexOf(text[i])]
            }
            break
          }
          
          case 'japanese': {
            for (i = 0; i < text.length; i++) {
              result += jp[og.indexOf(text[i])]
            }
            break
          }

        }
        
        await interaction.reply(`${interaction.user.username} wanna say: ${result}`)
        break
      }
    }
    if (interaction.options._group == null) {
      switch (interaction.options._subcommand) {
        case 'facts': {
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

          const factEmbed = new MessageEmbed()
          .setTitle('Facts')
          .setDescription('Fresh out of the oven.')
          .addField('The fact of the second is...', facts[Math.floor(Math.random() * facts.length)], false)
          .setAuthor(`${interaction.user.username}#${interaction.user.discriminator}`, `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png`)
          .setFooter(`${interaction.client.user.username}#${interaction.client.user.discriminator}`, `https://cdn.discordapp.com/avatars/${interaction.client.user.id}/${interaction.client.user.avatar}.png`)

          await interaction.reply({embeds: [factEmbed]})
          break
        }
      }
    }
  }
}

// module.exports.help = {
//   name: module.exports.data.name,
//   description: module.exports.data.description,
//   arguments: "<location>",
//   usage: '`/' + module.exports.data.name + ' <location>`'
// }