const slashCommand = require('../lib/structures/slashCommand');

class slashPing extends slashCommand {
  constructor(client) {
    super(client, {
      name: 'ping',
      description: 'Does the ping thing.',
      guildOnly: true
    });
  }

  async run(interaction) {
    try {
      await interaction.defer();
      const reply = interaction.editReply('Ping?');
      await interaction.editReply(`Pong! API Latency is ${Math.round(this.client.ws.ping)}ms.`);
    } catch (e) {
      console.log(e);
      return await interaction.editReply(`There was a problem with your request.\n\`\`\`${e.message}\`\`\``);
    }
  }
}

module.exports = slashPing;