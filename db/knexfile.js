// Update with your config settings.

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      host: '127.0.0.1',
      database: 'fb_bizchat_demo',
      user: 'postgres',
      password: '',
    },
  },

  // staging: {
  //   client: 'postgresql',
  //   connection: {
  //     host: config.POSTGRES_HOST_STAGING,
  //     database: config.POSTGRES_HOST_STAGING,
  //     user: config.POSTGRES_USER_STAGING,
  //     password: config.POSTGRES_PASSWORD_STAGING,
  //     ssl: config.POSTGRES_SSL_STAGING,
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   },
  // },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
