import { defineConfig } from 'drizzle-kit';
import './.envConfig.ts';

export default defineConfig({
    dialect: 'postgresql', // "mysql" | "sqlite" | "postgresql"
    schema: './drizzle/schema.ts',
    out: './drizzle',
    dbCredentials: {
        host: process.env.PG_HOST!,
        port: Number(process.env.PG_PORT),
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DB!,
        ssl: {
            rejectUnauthorized: false,
        },
    },
});
