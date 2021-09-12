const slashCommand = require("../../base/slashCommand.js");

const { caseNumber } = require('../../modules/caseNumber');
const { lang } = require('../../util/functions');

module.exports = class Kick extends slashCommand {
  constructor(client) {
    super(client, {
      name: "kick",
      description: "Bans a user from a guild.",
      options: [{
        name: "target",
        description: "The user you wish to ban.",
        type: "USER",
        required: true
      },
      {
        name: "reason",
        description: "Why were they kicked?",
        type: "STRING"
      }],
      guildOnly: true // Set this to false if you want it to be global.
    });
  }

  async run(client, interaction) {
    try {
      const modlog = interaction.guild.channels.cache.find(channel => channel.name === 'modlog')
      if (!modlog) return this.client.emit('commandInteractionFail', interaction, lang('NO_CHAN', { chan: 'modlog' }));
      const caseNum = await caseNumber(this.client, modlog);

      const days = 0;
      const member = interaction.options.getUser("target");
      const reason = interaction.options.getString("reason") ?? `Awaiting moderator input. Use **__reason ${caseNum} <reason>**.`;
      
      await interaction.reply({ content: `Attempting to kick ${member.tag}`, ephemeral: true });
      await interaction.guild.members.kick(member, { reason });
      this.client.emit('infractionCreate', '0xFF0000', 'Kick', days, member.user, interaction.user.member, reason, caseNum, modlog);
      
      await interaction.editReply(`${member.user.tag} was successfully kicked.`);
    } catch (e) {
      console.log(e);
      return await interaction.editReply(`There was a problem with your request.\n\`\`\`${e.message}\`\`\``);
    }
  }
};
