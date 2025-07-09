process.loadEnvFile(`${__dirname}/../../../.env`);

export const configLoader = () => ({
    port: process.env.PORT || 3000,
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpirationTime: process.env.JWT_EXPIRATION_TIME || '1h',
})