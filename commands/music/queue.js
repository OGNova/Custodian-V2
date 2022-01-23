const { MessageEmbed } = require('discord.js');
const Command = require('../../base/Command');

module.exports = class Queue extends Command {
  constructor(client) {
    super(client, {
      name: 'queue',
      guildOnly: true
    });
  }

  async run(message) {
    const player = this.client.player;
    const queue = player.getQueue(message.guild.id);

    if (!queue || !queue.playing) return message.reply({ content: 'There is no music currently playing.', ephemeral: true });

    if (!queue.tracks[0]) return message.reply({ content: 'There are no songs queued.', ephemeral: true });
      
    const tracks = queue.tracks.map((track, i) => `**${i+1}** - ${track.title} | ${track.author} (Requested by <@${track.requestedBy.id}>)`);
    const songs = queue.tracks.length;
    const nextSongs = songs > 5 ? `And **${songs-5}** other songs...` : `There are **${songs}** songs queued.`;

    const methods = ['🔁', '🔂'];
    const embed = new MessageEmbed()
      .setColor('RED')
      .setTitle(`Server Queue - ${message.guild.name} ${methods[queue.repeatMode]}`)
      .setThumbnail(message.guild.iconURL({ size: 2048, dynamic: true }))
      .setDescription(`Currently Playing: **\`${queue.current.title}\`**\n\n${tracks.slice(0,5).join('\n')}\n\n${nextSongs}`)
      .setTimestamp()
      .setFooter('bleh', message.guild.me.avatarURL({ dynamic: true }));
      
    message.channel.send({ embeds: [embed] });
  }
};