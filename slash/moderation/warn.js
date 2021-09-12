// const Command = require('../../base/Command');
// const { parseUser } = require('../../modules/parseUser');
// const { caseNumber } = require('../../modules/caseNumber');
// const { lang } = require('../../util/functions');

// module.exports = class Warn extends Command {
//   constructor(client) {
//     super(client, {
//       name: 'warn',
//       permLevel: 'Moderator'
//     });
//   }

//   async run(message, args) {
//     const user = message.mentions.users.first();
//     if (!user) return this.client.emit('commandFail', message, lang('NO_MEMBER', { action: 'warn' }));

//     const member = message.guild.members.cache.get(user.id);

//     parseUser(message, user);

//     const modlog = message.guild.channels.cache.find(channel =>  channel.name === 'modlog');
//     if (!modlog) return this.client.emit('commandFail', message, lang('NO_CHAN', { chan: 'modlog' }));
//     const caseNum = await caseNumber(this.client, modlog);

//     const reason = args.splice(1, args.length).join(' ') || `Awaiting moderator input. Use **__reason ${caseNum} <reason>**.`;

//     this.client.emit('infractionCreate', '0xFF9E00', 'Warn', 0, member.user, message, reason, caseNum, modlog);
//   }
// };

const slashCommand = require("../../base/slashCommand.js");

const { caseNumber } = require('../../modules/caseNumber');
const { lang } = require('../../util/functions');

module.exports = class Warn extends slashCommand {
  constructor(client) {
    super(client, {
      name: "warn",
      description: "Bans a user from a guild.",
      options: [{
        name: "target",
        description: "The user you wish to warn.",
        type: "USER",
        required: true
      },
      {
        name: "reason",
        description: "Why were they warned?",
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
