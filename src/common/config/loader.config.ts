process.loadEnvFile(`${__dirname}/../../../.env`);

export const configLoader = () => ({
    port: process.env.PORT || 3000,
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpirationTime: process.env.JWT_EXPIRATION_TIME || '1h',
    jwtSecretRefresh: process.env.JWT_SECRET_REFRESH,
    jwtExpirationTimeRefresh: process.env.JWT_EXPIRATION_TIME_REFRESH,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,
})