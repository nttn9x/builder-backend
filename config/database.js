module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'mongoose',
      settings: {
        host: env('DATABASE_HOST', 'ds125288.mlab.com'),
        srv: env.bool('DATABASE_SRV', false),
        port: env.int('DATABASE_PORT', 25288),
        database: env('DATABASE_NAME', 'elrond'),
        username: env('DATABASE_USERNAME', 'nttn9x'),
        password: env('DATABASE_PASSWORD', 'Kim@123456'),
      },
      options: {
        authenticationDatabase: env('AUTHENTICATION_DATABASE', "elrond"),
        ssl: env.bool('DATABASE_SSL', false),
      },
    },
  },
});
