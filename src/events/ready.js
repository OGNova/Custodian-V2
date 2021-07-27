const Event = require('../lib/structures/Event');

const { MessageEmbed } = require('discord.js');

class Ready extends Event {
  constructor(client) {
    super(client, {
      name: 'ready'
    });
  }
  
  async run() {    
    if (this.client.users.cache.has('1')) {
      this.client.users.cache.delete('1');
    }
    
    const embed = new MessageEmbed()
      .setTitle('Connected to Gateway')
      .setAuthor('Discord Logger', 'https://discordapp.com/assets/2c21aeda16de354ba5334551a883b481.png')
      .setDescription(`Session ID ${this.client.ws.shards.first().sessionID}`)
      .setFooter('Novuh')
      .setTimestamp();

    await this.client.channels.cache.get('580612780483280906').send({ embeds: [ embed ] });

    this.client.logger.login(`Logged in as ${this.client.user.username}`);
    this.client.user.setActivity(`__help | ${this.client.guilds.cache.size} Servers`);

    // await this.client.wait(1000);
  }
}

module.exports = Ready;