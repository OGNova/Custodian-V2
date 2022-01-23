const { QueryType } = require('discord-player');
const { MessageEmbed } = require('discord.js');
const Command = require('../../base/Command.js');

module.exports = class Search extends Command {
  constructor(client) {
    super(client, {
      name: 'search',
      guildOnly: true
    });
  }

  async run(message, args) {
    const search = args.join(' ');
    const player = this.client.player;
    
    if (!search) return message.reply({ content: 'give me something idiot', ephemeral: true });

    const res = await player.search(search, {
      requestedBy: message.member,
      searchEngine: QueryType.AUTO
    });

    if (!res || !res.tracks.length) return message.reply({ content: 'No search results found', ephemeral: true });

    const queue = await player.createQueue(message.guild, {
      metadata: message.channel
    });
    const maxTracks = res.tracks.slice(0, 10);

    const embed = new MessageEmbed()
      .setColor('RED')
      .setTitle(`Search: ${args.join(' ')}`)
      .setDescription(`${maxTracks.map((track, i) => `**${i + 1}**. ${track.title} | ${track.author}`).join('\n')}\n\nChoose a song from **1** to **${maxTracks.length}** or say **cancel** to cancel the search.`)
      .setTimestamp()
      .setFooter('bleh');

    message.channel.send({ embeds: [embed] });

    const collector = message.channel.createMessageCollector({
      time: 15000,
      errors: ['time'],
      filter: m => m.author.id === message.author.id
    });

    collector.on('collect', async (query) => {
      if (query.content.toLowerCase() === 'cancel') return message.reply({ content: 'Search cancelled.' }) && collector.stop();

      const value = parseInt(query.content);
      if (!value || value <= 0 || value > maxTracks.length) return message.reply({ content: `Error: select a song **1** to **${maxTracks.length}** or say **cancel** to cancel the search.`, ephemeral: true });

      collector.stop();

      try {
        if (!queue.connection) await queue.connect(message.member.voice.channel);
      } catch {
        await player.deleteQueue(message.guild.id);
        return message.reply({ content: 'I can\'t join your voice channel, please try again.', ephemeral: true });
      }

      const song = res.tracks[Number(query.content)-1];
      await message.reply({ content: `Loading song: **\`${song.title}\`** 🎧`, ephemeral: true });

      queue.addTrack(song);
      if (!queue.playing) await queue.play();
    });

    collector.on('end', (message, reason) => {
      if (reason === 'time') return message.reply({ content: 'Search time expired.', ephemeral: true });
    });
  }
};