const knex = require("knex")({
  client: "postgresql",
  connection: process.env.DATABASE_URL,
});

module.exports = knex;
