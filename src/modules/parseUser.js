exports.parseUser = (message, user) => {
  const member = message.guild.members.cache.get(user.id) || null;
  if (user.id === message.author.id) {
    return message.channel.send('You cannot do that to yourself, why did you try?');
  } else if (member) {
    if (member.roles.highest.rawPosition >= message.member.roles.highest.rawPosition) return message.channel.send('The targeted member has a higher or equal role position than you.');
  }
  return user;
};