import { Pool } from 'pg'

export const db = new Pool ({
    user: 'postgres',
    host: 'localhost',
    password: 'konfirmasi',
    port: '5432',
    database: 'personal-web',
    max: '5'
});