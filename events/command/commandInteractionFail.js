const Event = require('../../base/Event.js');

module.exports = class commandFail extends Event {
  constructor(client) {
    super(client, {
      name: 'commandFail'
    });
  }

  async run(interaction, failContent) {
    interaction.reply({ content: failContent, ephemeral: true  });
  }
};