const Command = require('../../base/Command');
const { parseUser } = require('../../modules/parseUser');
const { caseNumber } = require('../../modules/caseNumber');
const { lang } = require('../../util/functions');

module.exports = class Mute extends Command {
  constructor(client) {
    super(client, {
      name: 'mute',
      permLevel: 'Moderator'
    });
  }

  async run(message, args) {
    let action;
    let color;

    const user = message.mentions.users.first();
    if (!user) return this.client.emit('commandFail', message, lang('NO_MEMBER', { action: 'mute' }));
    
    const member = message.guild.members.cache.get(user.id);

    parseUser(message, user);

    const modlog = message.guild.channels.cache.find(channel =>  channel.name === 'modlog');
    if (!modlog) return this.client.emit('commandFail', message, lang('NO_CHAN', { chan: 'modlog' }));
    const caseNum = await caseNumber(this.client, modlog);

    const muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');
    if (!muteRole) return this.client.emit('commandFail', message, lang('NO_MUTE_ROLE', { role: 'Muted' }));


    const reason = args.splice(1, args.length).join(' ') || `Awaiting moderator input. Use **__reason ${caseNum} <reason>**.`;
  

    if (member._roles.includes(muteRole.id)) {
      action = 'Unmute';
      color = '0x00AE86';
    } else {
      action = 'Mute';
      color = '0xFFFF00';
    }

    this.client.emit('infractionCreate', color, action, 0, member.user, message, reason, caseNum, modlog);
    
    if (member._roles.includes(muteRole.id)) {
      member.roles.remove(muteRole);
    } else {
      member.roles.add(muteRole);
    }
  }
};

