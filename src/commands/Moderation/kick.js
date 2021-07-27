const Command = require('../../lib/structures/Command');
const { parseUser } = require('../../modules/parseUser');
const { caseNumber } = require('../../modules/caseNumber');

const { MessageEmbed } = require('discord.js');

class Kick extends Command {
  constructor(client) {
    super(client, {
      name: 'kick',
      permLevel: 'Moderator'
    });
  }

  async run(message, args) {
    const user = message.mentions.users.first();
    if (!user) return message.reply({ content: '\`|\`<:redTick:607067960430952459>\`|\` You must mention someone to kick them.' });
    
    const member = message.guild.members.cache.get(user.id);
    
    parseUser(message, user);

    const modlog = message.guild.channels.cache.find(channel =>  channel.name === 'modlog');
    if (!modlog) return message.reply({ content: '\`|\`<:redTick:607067960430952459>\`|\` Please create a channel called **modlog** and try again.' });
    const caseNum = await caseNumber(this.client, modlog);

    const reason = args.splice(2, args.length).join(' ') || `Awaiting moderator input. Use **__reason ${caseNum} <reason>**.`;

    const logEmbed = new MessageEmbed()
      .setTimestamp()  
      .setColor(0xFFA500)
      .setDescription(`**Action:** Kick\n**Target:** ${member.user.username}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}`)
      .setFooter(`Case ${caseNum}`);

    this.client.channels.cache.get(modlog.id).send({ embeds: [ logEmbed ] });
    member.kick(reason);
    await this.client.db.createInfraction(caseNum, member.user.id, message.author.id, reason, 'kick', new Date(), true);
  }
}

module.exports = Kick;