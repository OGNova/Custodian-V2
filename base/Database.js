const { Client } = require('pg');
const chalk = require('chalk');

var connection = new Client({
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD
});

module.exports.connect = function() {
  console.log(chalk`{bold.green DEBUG:} Opening connection to database.`);
  connection.connect();
  this.query(
    'CREATE TABLE IF NOT EXISTS guilds (      \
      "id" BIGSERIAL PRIMARY KEY,             \
      "name" TEXT,                            \
      "owner" BIGSERIAL,                      \
      "infCount" INT                          \
    );'
  );

  this.query(
    'CREATE TABLE IF NOT EXISTS members (     \
      "id" BIGSERIAL PRIMARY KEY,             \
      "name" TEXT,                            \
    );'
  );
  
  this.query(
    'CREATE TABLE IF NOT EXISTS infractions ( \
      "id" INT PRIMARY KEY,                   \
      "user" BIGSERIAL,                       \
      "guild_id" BIGSERIAL,                   \
      "actor_id" BIGSERIAL,                   \
      "reason" TEXT,                          \
      "type" TEXT,                            \
      "createdAt" DATETIME,                   \
      "active" BOOLEAN                        \
    );'
  );

  console.log(chalk`{bold.green DEBUG:} Done. Starting bot.`);
};

// Server Related Queries

module.exports.addServer = function(id, name, owner) {
  const addServerQuery = {
    text: 'INSERT INTO guilds (id, name, owner) ' +
          'VALUES ($1, $2, $3)',
    values: [id, name, owner]
  };
  return connection.query(addServerQuery);
};
  
  
module.exports.removeServer = function(id) {
  const removeServerQuery = {
    text: 'DELETE FROM guilds WHERE id = $1',
    values: [id]
  };
  return connection.query(removeServerQuery);
};

  
module.exports.getServer = function(id) {
  const getServerQuery = {
    text: 'SELECT * FROM guilds WHERE id = $1',
    values: [id]
  };
  return connection.query(getServerQuery);
};


// Member Related Queries

module.exports.addMember = function(id, name) {
  const addMemberQuery = {
    text: 'INSERT INTO members (id, name) ' +
          'VALUES ($1, $2)',
    values: [id, name]
  };
  return connection.query(addMemberQuery);
};


module.exports.createInfraction = function(id, user, guild_id, actor_id, reason, type, createdAt, active) {
  const createInfractionQuery = {
    text: 'INSERT INTO infractions (id, user, guild_id, actor_id, reason, type, createdAt, active' +
          'VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    values: [id, user, guild_id, actor_id, reason, type, createdAt, active]
  };
  return connection.query(createInfractionQuery);
};

module.exports.updateInfractionReason = function(id, reason) {
  const updateInfractionReasonQuery = {
    text: 'UPDATE infractions SET reason = $2 WHERE id = $1',
    values: [id, reason]
  };
  return connection.query(updateInfractionReasonQuery);
};

module.exports.deleteInfraction = function(id) {
  const deleteInfractionQuery = {
    text: 'DELETE FROM infractions WHERE id = $1',
    values: [id]
  };
  return connection.query(deleteInfractionQuery);
};

module.exports.deactivateInfraction = function(id, active) {
  const deactivateInfractionQuery = {
    text: 'UPDATE infractions SET active = $2 WHERE id = $1',
    values: [id, active]
  };
  return connection.query(deactivateInfractionQuery);
};

// Helper Queries

module.exports.query = function(rawSQL) {
  const rawQuery = {
    text: rawSQL
  };
  return connection.query(rawQuery);
};