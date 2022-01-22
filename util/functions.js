function lang(key, data) {
  // Function originally created by Zajrik#2656 (214628307201687552)
  const strings = require('./lang.json');
  let loadedString = strings[key];
  if (typeof data === 'undefined') return loadedString;
  for (const token of Object.keys(data))
    loadedString = loadedString.replace(new RegExp(`{{ *${token} *}}`, 'g'), data[token]);
  return loadedString;
}

async function permCheck(interaction, user) {
  const member = interaction.guild.members.cache.get(user.id) || null;
  if (user.id === interaction.user.member.id) {
    return interaction.editReply('You cannot do that to yourself, why did you try?');
  } else if (member) {
    if (member.roles.highest.rawPosition >= interaction.user.member.roles.highest.rawPosition) return interaction.editReply('The targeted member has a higher or equal role position than you.');
  }
  return user;
}

module.exports = { lang, permCheck };