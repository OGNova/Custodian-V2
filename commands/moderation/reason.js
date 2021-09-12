const { MessageEmbed } = require('discord.js');
const Command = require('../../base/Command');

class Reason extends Command {
  constructor(client) {
    super(client, {
      name: 'reason',
      permLevel: 'Moderator'
    });
  }

  async run(message, args) {
    const modlog = message.guild.channels.cache.find(channel => channel.name === 'modlog');
    const caseNum = args.shift();
    const newReason = args.join(' ');

    await modlog.messages.fetch({ limit: 100 }).then((messages) => {
      const caseLog = messages.filter(m => m.author.id === this.client.user.id &&
        m.embeds[0] &&
        m.embeds[0].type === 'rich' &&
        m.embeds[0].footer &&
        m.embeds[0].footer.text.startsWith('Case') &&
        m.embeds[0].footer.text === `Case ${caseNum}`    
      ).first();
      modlog.messages.fetch(caseLog.id).then(logMsg => {
        const embed = logMsg;
        
        const oldEmbed = embed.embeds[0];
        const oldEmbedDesc = embed.embeds[0].description.split('\n');
        
        const newLogEmbed = new MessageEmbed()
          .setTimestamp(oldEmbed.timestamp)
          .setColor(oldEmbed.color)
          .setDescription(`${oldEmbedDesc[0]}\n${oldEmbedDesc[1]}\n${oldEmbedDesc[2]}\n**Reason:** ${newReason}`)
          .setFooter(`Case ${caseNum}`);
        logMsg.edit({ embed: newLogEmbed });

        this.client.db.updateInfractionReason(caseNum, newReason);
      });
    });
  }
}

module.exports = Reason;