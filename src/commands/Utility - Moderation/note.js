const Command = require('../../lib/structures/Command');

class Note extends Command {
  constructor(client) {
    super(client, {
      name: 'note',
      permLevel: 'Bot Owner'
    });
  }
  
  async run(message, args, level) {
    const action = args[0];
    const note = args.splice(2, args.length).join(' ');

    const user = message.mentions.users.first();
    const member = message.guiild.member(user);

    switch (action) {
      case 'add': {
        await this.client.db.addNote(member.user.id, note);
        return message.reply({ content: '\`|\`<:greenTick:607067961286459403>\`|\` Note successfully added.' });
      }
      case 'list': {
        await this.client.db.getNotes(member.user.id);
        // Magic to make a table of shit.
        return;
      }
      case 'remove': {
        await this.client.db.removeNote(member.user.id, noteID);
        return message.reply({ content: '\`|\`<:greenTick:607067961286459403>\`|\` Note successfully removed.' });
      }
    }
  }
}
  
module.exports = Note;