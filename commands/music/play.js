const Command = require('../../base/Command.js');

module.exports = class Play extends Command {
  constructor(client) {
    super(client, {
      name: 'play',
      guildOnly: true
    });
  }

  async run(message, args) {
    const player = this.client.player;
    const song = args.join(' ');

    if (!message.member.voice.channelId) return message.reply({ content: 'join a vc fuckwad' });
    if (message.guild.me.voice.channelId && message.member.voice.channelId !== message.guild.me.voice.channelId) return message.reply({ content: 'join my vc fuckwad' });

    const queue = player.createQueue(message.guild, {
      metadata: {
        channel: message.channel
      }
    });

    try {
      if (!queue.connection) await queue.connect(message.member.voice.channel);
    } catch {
      queue.destroy();
      return message.reply('fucked');
    }

    const track = await player.search(song, {
      requestedBy: message.member.user
    }).then(r => r.tracks[0]);
    if (!track) return await message.reply({ content: 'we ain\'t found shit' });
    
    queue.play(track);
    return await message.reply({ content: 'playing' });
  }
};