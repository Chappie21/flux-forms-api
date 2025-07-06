process.loadEnvFile(`${__dirname}/../../../.env`);

export const configLoader = () => ({
    port: process.env.PORT || 3000,
    databaseUrl: process.env.DATABASE_URL,
})