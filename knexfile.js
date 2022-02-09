// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'mysql2',
    connection: {
      host : '192.168.1.172',
      port : 3306,
      user : 'root',
      password : '123@123',
      database : 'tinker_crawl'
    },
    pool: { min: 0, max: 7 }
  },
  development2: {
    client: 'mysql2',
    connection: {
      host : '192.168.1.172',
      port : 3306,
      user : 'root',
      password : '123@123',
      database : 'tinker-clone'
    },
    pool: { min: 0, max: 7 }
  }

};
