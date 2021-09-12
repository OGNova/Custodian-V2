const Command = require('../../base/Command');
const { parseUser } = require('../../modules/parseUser');
const { caseNumber } = require('../../modules/caseNumber');
const { lang } = require('../../util/functions');

module.exports = class Ban extends Command {
  constructor(client) {
    super(client, {
      name: 'ban',
      permLevel: 'Moderator'
    });
  }

  async run(message, args) {
    const deleteDays = args[1];
    if (!deleteDays) return this.client.emit('commandFail', message, lang('NO_DAY'));
    if (deleteDays < 0 || deleteDays > 7) {
      return this.client.emit('commandFail', message, lang('INVALID_LENGTH'));
    }

    const user = message.mentions.users.first();
    if (!user) return this.client.emit('commandFail', message, lang('NO_MEMBER', { action: 'ban' }));

    const member = message.guild.members.cache.get(user.id);

    parseUser(message, user);

    const modlog = message.guild.channels.cache.find(channel =>  channel.name === 'modlog');
    if (!modlog) return this.client.emit('commandFail', message, lang('NO_CHAN', { chan: 'modlog' }));
    const caseNum = await caseNumber(this.client, modlog);

    const reason = args.splice(2, args.length).join(' ') || `Awaiting moderator input. Use **__reason ${caseNum} <reason>**.`;


    this.client.emit('infractionCreate', '0xFF0000', 'Ban', deleteDays, member.user, message, reason, caseNum, modlog);
    
    // member.ban({ days: `${deleteDays}`, reason });
  }
};