const Event = require('../../base/Event.js');

const { MessageEmbed } = require('discord.js');

module.exports = class infractionCreate extends Event {
  constructor(client) {
    super(client, {
      name: 'infractionCreate'
    });
  }

  async run(color, action, days, member, mod, reason, caseNum, modlog) {
    const logEmbed = new MessageEmbed()
      .setTimestamp()
      .setColor(color)
      .setDescription(`**Action:** ${action}\n**Deleted Messages:** ${days}\n**Target:** ${member.username}\n**Moderator:** ${mod.tag}\n**Reason:** ${reason}`)
      .setFooter(`Case ${caseNum}`);
    
    this.client.channels.cache.get(modlog.id).send({ embeds: [ logEmbed ] });
    // await this.client.db.createInfraction(caseNum, member.user.id, message.author.id, reason, action, new Date(), true);
  }
};