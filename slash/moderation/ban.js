const slashCommand = require("../../base/slashCommand.js");

const { caseNumber } = require('../../modules/caseNumber');
const { lang } = require('../../util/functions');

module.exports = class Ban extends slashCommand {
  constructor(client) {
    super(client, {
      name: "ban",
      description: "Bans a user from a guild.",
      options: [{
        name: "target",
        description: "The user you wish to ban.",
        type: "USER",
        required: true
      },
      {
        name: "days",
        description: "How many days do you wish to purge?",
        type: "INTEGER"
      },
      {
        name: "reason",
        description: "Why were they banned?",
        type: "STRING"
      }],
      guildOnly: true // Set this to false if you want it to be global.
    });
  }

  async run(client, interaction) {
    try {
      const modlog = interaction.guild.channels.cache.find(channel => channel.name === 'modlog')
      if (!modlog) return this.client.emit('ccommandInteractionFail', interaction, lang('NO_CHAN', { chan: 'modlog' }));
      const caseNum = await caseNumber(this.client, modlog);

      const days = interaction.options.getInteger("days") ?? 0;
      const member = interaction.options.getUser("target");
      const reason = interaction.options.getString("reason") ?? `Awaiting moderator input. Use **__reason ${caseNum} <reason>**.`;
      
      await interaction.reply({ content: `Attempting to ban ${member.tag}`, ephemeral: true });
      await interaction.guild.members.ban(member, { days, reason });
      this.client.emit('infractionCreate', '0xFF0000', 'Ban', days, member.user, interaction.user.member, reason, caseNum, modlog);
      
      await interaction.editReply(`${member.user.tag} was successfully banned`);
    } catch (e) {
      console.log(e);
      return await interaction.editReply(`There was a problem with your request.\n\`\`\`${e.message}\`\`\``);
    }
  }
};
