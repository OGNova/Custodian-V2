const Event = require('../../base/Event.js');

module.exports = class commandSuccess extends Event {
  constructor(client) {
    super(client, {
      name: 'commandSuccess'
    });
  }

  async run(message, successContent) {
    message.reply({ content: successContent });
  }
};