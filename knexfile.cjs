// knexfile.cjs
require('dotenv').config(); // load .env

module.exports = {
    development: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST || '127.0.0.1',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'myapp'
        },
        migrations: {
            directory: './migrations'
        },
        seeds: {
            directory: './seeds'
        }
    },

    production: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        },
        migrations: {
            directory: './migrations'
        },
        seeds: {
            directory: './seeds'
        }
    }
};
