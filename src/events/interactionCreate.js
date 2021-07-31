// module.exports = class {
//   constructor(client) {
//     this.client = client;
//   }
  
// };


const Event = require('../lib/structures/Event');

class interactionCreate extends Event {
  constructor(client) {
    super(client, {
      name: 'interactionCreate'
    });
  }
  async run(interaction) {
    // If it's not a command, stop.
    if (!interaction.isCommand()) return;
    // Grab the command data from the client.slashcmds Collection
    const cmd = this.client.slashcmds.get(interaction.commandName);
    // If that command doesn't exist, silently exit and do nothing
    if (!cmd) return;
    // Run the command
    cmd.run(interaction);

  }
}

module.exports = interactionCreate;