const Command = require('../../base/Command.js');

module.exports = class Stop extends Command {
  constructor(client) {
    super(client, {
      name: 'stop',
      guildOnly: true
    });
  }

  async run(message) {
    const player = this.client.player;
    
    const queue = player.getQueue(message.guild.id);
    if (!queue || !queue.playing) return message.reply({ content: '❌ | There is currently no music playing.', ephemeral: true });

    await queue.destroy();
    message.reply({ content: 'Stopped.', ephemeral: true });
  }
};