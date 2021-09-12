const Command = require('../../base/Command');
const { parseUser } = require('../../modules/parseUser');
const { caseNumber } = require('../../modules/caseNumber');
const { lang } = require('../../util/functions');

module.exports = class Warn extends Command {
  constructor(client) {
    super(client, {
      name: 'warn',
      permLevel: 'Moderator'
    });
  }

  async run(message, args) {
    const user = message.mentions.users.first();
    if (!user) return this.client.emit('commandFail', message, lang('NO_MEMBER', { action: 'warn' }));

    const member = message.guild.members.cache.get(user.id);

    parseUser(message, user);

    const modlog = message.guild.channels.cache.find(channel =>  channel.name === 'modlog');
    if (!modlog) return this.client.emit('commandFail', message, lang('NO_CHAN', { chan: 'modlog' }));
    const caseNum = await caseNumber(this.client, modlog);

    const reason = args.splice(1, args.length).join(' ') || `Awaiting moderator input. Use **__reason ${caseNum} <reason>**.`;

    this.client.emit('infractionCreate', '0xFF9E00', 'Warn', 0, member.user, message, reason, caseNum, modlog);
  }
};