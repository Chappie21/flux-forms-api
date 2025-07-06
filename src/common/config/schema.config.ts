import * as joi from 'joi';

export const schemaConfig = joi.object({
  PORT: joi.number().default(3000),
  DATABASE_URL: joi.string().required(),
});