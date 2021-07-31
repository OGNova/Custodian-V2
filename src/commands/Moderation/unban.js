const Command = require('../../lib/structures/Command');
const { parseUser } = require('../../modules/parseUser');
const { caseNumber } = require('../../modules/caseNumber');

const { MessageEmbed } = require('discord.js');

class Unban extends Command {
  constructor(client) {
    super(client, {
      name: 'unban',
      permLevel: 'Moderator'
    });
  }

  async run(message, args) {
    const userID = args[0];
    
    if (!userID) return message.reply({ content: '\`|\`<:redTick:607067960430952459>\`|\` You must mention someone to unban them.' });

    const modlog = message.guild.channels.cache.find(channel =>  channel.name === 'modlog');
    if (!modlog) return message.reply({ content: '\`|\`<:redTick:607067960430952459>\`|\` Please create a channel called **modlog** and try again.' });
    const caseNum = await caseNumber(this.client, modlog);

    const reason = args.splice(1, args.length).join(' ') || `Awaiting moderator input. Use **__reason ${caseNum} <reason>**.`;

    message.guild.members.unban(userID).then(user => {
      const logEmbed = new MessageEmbed()
        .setTimestamp()  
        .setColor(0x00AE86)
        .setDescription(`**Action:** Unban\n**Target:** ${user.username}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}`)
        .setFooter(`Case ${caseNum}`);

      this.client.channels.cache.get(modlog.id).send({ embeds: [ logEmbed ] });
      this.client.db.deactivateInfraction(caseNum, false);
    });
  }
}

module.exports = Unban;