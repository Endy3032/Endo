const fs = require("fs")
const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js');
colors = ['5865F2', '57F287', 'FEE75C', 'EB459E', 'ED4245',
          'F47B67', 'F8A532', '48B784', '45DDCO', '99AAB5',
          '23272A', 'B7C2CE', '4187ED', '36393F', '3E70DD',
          '4P5D7F', '7289DA', '4E5D94', '9C84EF', 'F47FFF',
          'FFFFFF', '9684ec', '583694', '37393e', '5866ef',
          '3da560', 'f9a62b', 'f37668', '49ddc1', '4f5d7e',
          '09bOf2', '2f3136', 'ec4145', 'fe73f6', '000000']

module.exports = {
  data: new SlashCommandBuilder()
  .setName('help')
  .setDescription('Show the list of all available commands'),
  
  async execute(interaction) {
    const help_main = new MessageEmbed()
      .setColor(`#${colors[Math.floor(Math.random() * colors.length)]}`)
      .setTitle('Help')
      .setAuthor(`${interaction.user.username}#${interaction.user.discriminator}`, `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png`)
      .setDescription('`[arguments]` are optional\n`<arguments>` are required')
      .addFields({ name: 'Navigate the help menu', value: 'Click the next/back buttons or use\nthe dropdown menu to navigate!' })
      .setTimestamp()
      .setFooter(`${interaction.client.user.username}#${interaction.client.user.discriminator}`, `https://cdn.discordapp.com/avatars/${interaction.client.user.id}/${interaction.client.user.avatar}.png`);

    await interaction.reply({ embeds: [help_main] });
	}
}

module.exports.help = {
  name: module.exports.data.name,
  description: module.exports.data.description,
  arguments: "none",
  usage: '`/' + module.exports.data.name + '`'
}

/* module.exports.run = async(bot, message, args, con) => {
    fs.readdir("./cmds/", (err, files) => {
        if(err) console.error(err);

        let jsfiles = files.filter(f => f.split(".").pop() === "js");
        if(jsfiles.length <= 0) {
            console.log("No commands to load!");
            return;
        }

        var namelist = "";
        var desclist = "";
        var usage = "";

        let result = jsfiles.forEach((f, i) => {
            let props = require(`./${f}`);
            namelist = props.help.name;
            desclist = props.help.description;
            usage = props.help.usage;
        });

        message.author.send(`**${namelist}** \n${desclist} \n${usage}`);
    });
}*/
