const Command = require('../../lib/structures/Command');
const { loadCommand, unloadCommand, reloadEvent } = require('../../util/functions');

class Reload extends Command {
  constructor(client) {
    super(client, {
      name: 'reload',
      permLevel: 'Bot Owner'
    });
  }

  async run(message, args, level) {
    if (!args || args.size < 1) return message.reply({ content: '\`|\`<:redTick:607067960430952459>\`|\` You must supply a command or event to reload.'});
    const module = args.join(' ');
    const command = this.client.commands.get(module) || this.client.commands.get(this.client.aliases.get(module));
    if (command) {
      let response = await unloadCommand(this.client, command.conf.location, command.help.name);
      if (response) return message.reply({ content: `Error unloading: ${response}` });

      response = loadCommand(this.client, command.conf.location, command.help.name);
      if (response) return message.reply({ content: `Error loading: ${response}` });
      return message.reply({ content: `\`|\`<:greenTick:607067961286459403>\`|\` The module ${command.help.name} was reloaded.`});
    }

    if (!command) {
      const event = this.client.events.get(module);
      if (!event) {
        return message.reply({ content: `\`|\`<:redTick:607067960430952459>\`|\` The module \`${module}\` is neither a command, a command alias, or an event. Please check your spelling and try again.` });
      }
      const response = await reloadEvent(this.client, event.conf.location, event.conf.name);
      if (response) return message.reply({ content: `Error unloading: ${response}` });
      
      return message.reply({ content: `\`|\`<:greenTick:607067961286459403>\`|\` The event \`${event.conf.name}\` was reloaded.` });
    }
  }
}

module.exports = Reload;