const Command = require('../../lib/structures/Command');
const { parseUser } = require('../../modules/parseUser');
const { caseNumber } = require('../../modules/caseNumber');

const { MessageEmbed } = require('discord.js');

class Mute extends Command {
  constructor(client) {
    super(client, {
      name: 'mute',
      permLevel: 'Moderator'
    });
  }

  async run(message, args) {
    let action;
    let embedColor;

    const user = message.mentions.users.first();
    if (!user) return message.reply({ content: '\`|\`<:redTick:607067960430952459>\`|\` You must mention someone to mute them.' });
    
    const member = message.guild.members.cache.get(user.id);

    parseUser(message, user);

    const modlog = message.guild.channels.cache.find(channel =>  channel.name === 'modlog');
    if (!modlog) return message.reply({ content: '\`|\`<:redTick:607067960430952459>\`|\` Please create a channel called **modlog** and try again.' });
    const caseNum = await caseNumber(this.client, modlog);

    const muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');
    if (!muteRole) return message.reply({ content: '\`|\`<:redTick:607067960430952459>\`|\` Please create a `Muted` role and try again.'});


    const reason = args.splice(1, args.length).join(' ') || `Awaiting moderator input. Use **__reason ${caseNum} <reason>**.`;
  

    if (member._roles.includes(muteRole.id)) {
      action = 'Unmute';
      embedColor = '0x00AE86';
    } else {
      action = 'Mute';
      embedColor = '0xFFFF00';
    }

    const logEmbed = new MessageEmbed()
      .setTimestamp()  
      .setColor(embedColor)
      .setDescription(`**Action:** ${action} \n**Target:** ${member.user.username}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}`)
      .setFooter(`Case ${caseNum}`);

    this.client.channels.cache.get(modlog.id).send({ embeds: [ logEmbed ] });
    
    if (member._roles.includes(muteRole.id)) {
      member.roles.remove(muteRole);
    } else {
      member.roles.add(muteRole);
    }
    await this.client.db.createInfraction(caseNum, member.user.id, message.author.id, reason, 'mute', new Date(), true);
  }
}

module.exports = Mute;