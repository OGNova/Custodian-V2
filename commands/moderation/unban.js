const Command = require('../../base/Command');
const { caseNumber } = require('../../modules/caseNumber');
const { lang } = require('../../util/functions');

module.exports = class Unban extends Command {
  constructor(client) {
    super(client, {
      name: 'unban',
      permLevel: 'Moderator'
    });
  }

  async run(message, args) {
    const userID = args[0];
    
    if (!userID) return this.client.emit('commandFail', message, lang('NO_MEMBER', { action: 'unban' }));

    const modlog = message.guild.channels.cache.find(channel =>  channel.name === 'modlog');
    if (!modlog) return this.client.emit('commandFail', message, lang('NO_CHAN', { chan: 'modlog' }));
    const caseNum = await caseNumber(this.client, modlog);

    const reason = args.splice(1, args.length).join(' ') || `Awaiting moderator input. Use **__reason ${caseNum} <reason>**.`;

    message.guild.members.unban(userID).then(user => {
      this.client.emit('infractionCreate', '0x00AE86', 'Unban', 0, user, message, reason, caseNum, modlog);
      this.client.db.deactivateInfraction(caseNum, false);
    });
  }
};