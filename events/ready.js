const { Team } = require('discord.js');

const { gray, green, magenta, magentaBright, white, yellow, cyan } = require('colorette');
const moment = require('moment');

const { version } = require('../package.json');

const Event = require('../base/Event.js');

module.exports = class Ready extends Event {
  constructor(client) {
    super(client, {
      name: 'ready'
    });
  }

  async run() {

    // Why await here? Because the ready event isn't actually ready, sometimes
    // guild information will come in *after* ready. 1s is plenty, generally,
    // for all of them to be loaded.
    // NOTE: client.wait is added when we create the Guidebot class in ../index.js!
    await this.client.wait(1000);

    if (!this.client.application?.owner) await this.client.application?.fetch();
    if (this.client.owners.length < 1) {
      if (this.client.application.owner instanceof Team) {
        this.client.owners.push(...this.client.application.owner.members.keys());
      } else {
        this.client.owners.push(this.client.application.owner.id);
      }
    }

    // Check whether the "Default" guild settings are loaded in the enmap.
    // If they're not, write them in. This should only happen on first load.
    if (!this.client.settings.has('default')) {
      if (!this.client.config.defaultSettings) throw new Error('defaultSettings not preset in config.js or settings database. Bot cannot load.');
      this.client.settings.set('default', this.client.config.defaultSettings);
    }

    // Set the game as the default help command + guild count.
    // NOTE: This is also set in the guildCreate and guildDelete events!
    this.client.user.setActivity(`${this.client.settings.get('default').prefix}help | ${this.client.guilds.cache.size} Servers`);
    this.printBanner();
    this.printUtilInfo();

    // this.client.logger.log(`${chalk.grey(`Loaded ${chalk.hex('#913c3c')(this.client.eventsList.length)} ${chalk.grey('events.')}`)}`, 'info');
    // this.client.logger.log(`${chalk.grey(`Loaded ${chalk.hex('#913c3c')(this.client.commandsList.length)} ${chalk.grey('commands.')}`)}`, 'info');
    // this.client.logger.log(`${chalk.grey(`${this.client.user.tag}, ready to serve ${this.client.users.cache.size} users in ${this.client.guilds.cache.size} servers.`)}`, 'info');
  }

  printBanner() {
    const dev = process.env.NODE_ENV !== 'production';
    const success = green('+');

    const llc = dev ? magentaBright : white;
    const blc = dev ? magenta : cyan;

    // const line01 = llc(' ________  ___  ___  ________  _________  ________  ________  ___  ________  ________          ');
    // const line02 = llc(' |\\   ____\\|\\  \\|\\  \\|\\   ____\\|\\___   ___\\\\   __  \\|\\   ___ \\|\\  \\|\\   __  \\|\\   ___  \\       ');
    // const line03 = llc('  \\ \\  \\___|\\ \\  \\\\\\  \\ \\  \\___|\\|___ \\  \\_\\ \\  \\|\\  \\ \\  \\_|\\ \\ \\  \\ \\  \\|\\  \\ \\  \\\\ \\  \\    ');
    // const line04 = llc('   \\ \\  \\    \\ \\  \\\\\\  \\ \\_____  \\   \\ \\  \\ \\ \\  \\\\\\  \\ \\  \\ \\\\ \\ \\  \\ \\   __  \\ \\  \\\\ \\  \\   ');
    // const line05 = llc('    \\ \\  \\____\\ \\  \\\\\\  \\|____|\\  \\   \\ \\  \\ \\ \\  \\\\\\  \\ \\  \\_\\\\ \\ \\  \\ \\  \\ \\  \\ \\  \\\\ \\  \\  ');
    // const line06 = llc('     \\ \\_______\\ \\_______\\____\\_\\  \\   \\ \\__\\ \\ \\_______\\ \\_______\\ \\__\\ \\__\\ \\__\\ \\__\\\\ \\__\\ ');
    // const line07 = llc('      \\|_______|\\|_______|\\_________\\   \\|__|  \\|_______|\\|_______|\\|__|\\|__|\\|__|\\|__| \\|__| ');

    const line01 = llc('     ______     _     __              ');
    const line02 = llc('    / ____/____(_)___/ /___ ___  __   ');
    const line03 = llc('   / /_  / ___/ / __  / __ `/ / / /   ');
    const line04 = llc('  / __/ / /  / / /_/ / /_/ / /_/ /    ');
    const line05 = llc(' /_/   /_/  /_/\\__,_/\\__,_/\\__, /  ');
    const line06 = llc('                          /____/      ');

    const pad = ' '.repeat(7);

    console.log(
      String.raw`
${line01}
${line02}${pad}${blc(version)}
${line03} ${pad}[${success}] Gateway
${line04}${dev ? ` ${pad}${blc('<')}${llc('/')}${blc('>')} ${llc('DEVELOPMENT MODE')}` : ''}
${line05}
${line06}
        `.trim()
    );
  }

  styleStore(store, last) {
    return gray(`${last ? '└─' : '├─'} Loaded ${this.style(store.size.toString().padEnd(3, ' '))} ${store.name}.`);
  }

  printUtilInfo() {
    const timestamp = `${moment().format('YYYY-MM-DD HH:mm:ss')}`;
    console.log(`${cyan(`${timestamp}`)} ${white('-')} ${cyan('INFO')} ${white('-')} ${gray('├─ Loaded')} ${yellow(`${this.client.events.size}`)} ${gray('events.')}`);
    console.log(`${cyan(`${timestamp}`)} ${white('-')} ${cyan('INFO')} ${white('-')} ${gray('  └─ Loaded')} ${yellow('5')} ${gray('event groups.')}`);
    console.log(`${cyan(`${timestamp}`)} ${white('-')} ${cyan('INFO')} ${white('-')} ${gray('├─ Loaded')} ${yellow(`${this.client.commands.size}`)} ${gray('commands.')}`);
    console.log(`${cyan(`${timestamp}`)} ${white('-')} ${cyan('INFO')} ${white('-')} ${gray('  └─ Loaded')} ${yellow('4')} ${gray('command groups.')}`);
    console.log(`${cyan(`${timestamp}`)} ${white('-')} ${cyan('INFO')} ${white('-')} ${gray('├─ Loaded')} ${yellow(`${this.client.slashcmds.size}`)} ${gray('slash commands.')}`);
    console.log(`${cyan(`${timestamp}`)} ${white('-')} ${cyan('INFO')} ${white('-')} ${gray('├─ Loaded')} ${yellow('15')} ${gray('routes.')}`);

    console.log(`${cyan(`${timestamp}`)} ${white('-')} ${cyan('INFO')} ${white('-')} ${gray(`├─ ${this.client.user.tag}, ready to serve ${this.client.users.cache.size} users in ${this.client.guilds.cache.size} servers.`)}`);
  }
};