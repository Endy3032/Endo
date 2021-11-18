const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')


module.exports = {
  data: new SlashCommandBuilder()
  .setName('fun')
  .setDescription('Random fun commands')
  .addSubcommandGroup(group => group
    .setName('achievement')
    .setDescription('Make your own Minecraft achievement')
    .addSubcommand(subcommand => subcommand
      .setName('icon_pack1')
      .setDescription('Make your own Minecraft achievement [Icon Pack #1]')
      .addStringOption(option => option
        .setName('icon')
        .setDescription('The icon for the achievement')
        .addChoice('random', '0')
        .addChoice('grass_block', '1')
        .addChoice('diamond', '2')
        .addChoice('diamond_sword', '3')
        .addChoice('creeper', '4')
        .addChoice('pig', '5')
        .addChoice('tnt', '6')
        .addChoice('cookie', '7')
        .addChoice('heart', '8')
        .addChoice('bed', '9')
        .addChoice('cake', '10')
        .addChoice('sign', '11')
        .addChoice('rail', '12')
        .addChoice('crafting_table', '13')
        .addChoice('redstone', '14')
        .addChoice('fire', '15')
        .addChoice('cobweb', '16')
        .addChoice('chest', '17')
        .addChoice('furnace', '18')
        .addChoice('book', '19')
        .addChoice('stone', '20')
        .setRequired(true)
      )
      .addStringOption(option => option
        .setName('content')
        .setDescription('The content of the achievement')
        .setRequired(true)
      )
      .addStringOption(option => option
        .setName('title')
        .setDescription('The title of the achievement')
        .setRequired(false)
      )
    )
    .addSubcommand(subcommand => subcommand
      .setName('icon_pack2')
      .setDescription('Make your own Minecraft achievement [Icon Pack #2]')
      .addStringOption(option => option
        .setName('icon')
        .setDescription('The icon for the achievement')
        .addChoice('random', '0')
        .addChoice('planks', '21')
        .addChoice('iron_ingot', '22')
        .addChoice('gold_ingot', '23')
        .addChoice('oak_door', '24')
        .addChoice('iron_door', '25')
        .addChoice('diamond_armor', '26')
        .addChoice('flint_and_steel', '27')
        .addChoice('potion', '28')
        .addChoice('splash', '29')
        .addChoice('spawn_egg', '30')
        .addChoice('coal_block', '31')
        .addChoice('iron_sword', '32')
        .addChoice('bow', '33')
        .addChoice('arrow', '34')
        .addChoice('iron_armor', '35')
        .addChoice('bucket', '36')
        .addChoice('water', '37')
        .addChoice('lava', '38')
        .addChoice('milk', '39')
        .setRequired(true)
      )
      .addStringOption(option => option
        .setName('content')
        .setDescription('The content of the achievement')
        .setRequired(true)
      )
      .addStringOption(option => option
        .setName('title')
        .setDescription('The title of the achievement')
        .setRequired(false)
      )
    )
  )
  .addSubcommandGroup(group => group
    .setName('format')
    .setDescription('Reformat a text to any style you want')
    .addSubcommand(subcommand => subcommand
      .setName('varied')
      .setDescription('mAkE yOuR tExT uSe VaRiEd CaSe')
      .addStringOption(option => option
        .setName('text')
        .setDescription('The text to be formatted [string]')
        .setRequired(true)
      )
    )
    .addSubcommand(subcommand => subcommand
      .setName('smallcaps')
      .setDescription('Mᴀᴋᴇ ʏᴏᴜʀ ᴛᴇxᴛ ᴜsᴇ sᴍᴀʟʟ ᴄᴀᴘs')
      .addStringOption(option => option
        .setName('text')
        .setDescription('The text to be formatted [string]')
        .setRequired(true)
      )
    )
    .addSubcommand(subcommand => subcommand
      .setName('superscript')
      .setDescription('ᵐᵃᵏᵉ ʸᵒᵘʳ ᵗᵉˣᵗ ᵗᶦⁿʸ (make your text tiny)')
      .addStringOption(option => option
        .setName('text')
        .setDescription('The text to be formatted [string]')
        .setRequired(true)
      )
    )
    .addSubcommand(subcommand => subcommand
      .setName('upsidedown')
      .setDescription('uʍopǝpᴉsdn ʇxǝʇ ɹnoʎ uɹnʇ (turn your text upsidedown)')
      .addStringOption(option => option
        .setName('text')
        .setDescription('The text to be formatted [string]')
        .setRequired(true)
      )
    )
    .addSubcommand(subcommand => subcommand
      .setName('fullwidth')
      .setDescription('Ｍａｋｅ　ｙｏｕｒ　ｔｅｘｔ　ｆｕｌｌ　ｗｉｄｔｈ')
      .addStringOption(option => option
        .setName('text')
        .setDescription('The text to be formatted [string]')
        .setRequired(true)
      )
    )
    .addSubcommand(subcommand => subcommand
      .setName('leet')
      .setDescription('1337ify y0uЯ 73x7 (leetify your text)')
      .addStringOption(option => option
        .setName('text')
        .setDescription('The text to be formatted [string]')
        .setRequired(true)
      )
    )
    .addSubcommand(subcommand => subcommand
      .setName('japanese')
      .setDescription('从卂长乇　丫口凵尺　丅乇乂丅　乚口口长丂　乚工长乇　丁卂尸卂ん乇丂乇 (make your text looks like japanese)')
      .addStringOption(option => option
        .setName('text')
        .setDescription('The text to be formatted [string]')
        .setRequired(true)
      )
    )
  )
  .addSubcommand(subcommand => subcommand
    .setName('facts')
    .setDescription('Get some random facts')
  ),

  async execute(interaction) {
    switch(interaction.options._group) {
      case 'achievement': {
        default_title = ['Achievement Get!', 'Advancement Made!', 'Goal Reached!', 'Challenge Complete!']

        interaction.options.getString('icon') !== '0' ? icon = interaction.options.getString('icon') : icon = Math.floor(Math.random() * 39)
        content = interaction.options.getString('content')
        interaction.options.getString('title') !== null ? title = interaction.options.getString('title') : title = default_title[Math.floor(Math.random() * default_title.length)]
        
        achievement_embed = new MessageEmbed()
        .setImage(`https://minecraftskinstealer.com/achievement/${icon}/${encodeURI(title)}/${encodeURI(content)}`)
        .setColor('#2f3136')

        await interaction.reply({embeds: [achievement_embed]})
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
            for (i = 0; i < text.length; i++) {
              i % 2 == 0 ? result += text[i] : result += text[i].toUpperCase()
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

          const fact_embed = new MessageEmbed()
          .setTitle('Facts')
          .setDescription('Fresh out of the oven.')
          .addField('The fact of the second is...', facts[Math.floor(Math.random() * facts.length)], false)
          .setAuthor(`${interaction.user.username}#${interaction.user.discriminator}`, `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png`)
          .setFooter(`${interaction.client.user.username}#${interaction.client.user.discriminator}`, `https://cdn.discordapp.com/avatars/${interaction.client.user.id}/${interaction.client.user.avatar}.png`)

          await interaction.reply({embeds: [fact_embed]})
          break
        }
      }
    }
  }
}

module.exports.help = {
  name: module.exports.data.name,
  description: module.exports.data.description,
  arguments: "<location>",
  usage: '`/' + module.exports.data.name + ' <location>`'
}