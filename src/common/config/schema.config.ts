import * as joi from 'joi';

export const schemaConfig = joi.object({
  PORT: joi.number().default(3000),
  DATABASE_URL: joi.string().required(),
  JWT_SECRET: joi.string().required(),
  JWT_EXPIRATION_TIME: joi.string().default('1h'),
  JWT_SECRET_REFRESH: joi.string().required(),
  JWT_EXPIRATION_TIME_REFRESH: joi.string().required(),
  GOOGLE_CLIENT_ID: joi.string().required(),
  GOOGLE_CLIENT_SECRET: joi.string().required(),
  GOOGLE_CALLBACK_URL: joi.string().required(),
});