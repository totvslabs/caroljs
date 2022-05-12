const { Pool } = require('pg/lib');

class Postgres {
    static getPool() {
        const pool = new Pool({
            user: process.env.DATABASE_USER || 'postgres',
            host: process.env.DATABASE_HOST || 'localhost',
            database: process.env.DATABASE_NAME || 'postgres',
            password: process.env.DATABASE_PASSWORD || '',
            port: process.env.DATABASE_PORT || 5432,
        });

        return pool;
    }
}

module.exports = Postgres;