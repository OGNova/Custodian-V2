class slashCommand {
  constructor(client, {
    name = null,
    description = 'No description provided.',
    category = 'Miscellaneous',
    usage = 'No usage provided.',
    advanced = '',
    guildOnly = false,
    aliases = new Array(),
    permLevel = 'User',
    botPerms = []
  }) {
    this.client = client;
    this.help = { name, description, category, usage, advanced };
    this.commandData = { name, description };
    this.conf = { guildOnly, aliases, permLevel, botPerms};
  }
}
  
module.exports = slashCommand;