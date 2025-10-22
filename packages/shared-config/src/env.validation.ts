import * as Joi from "joi";

export const envValidationSchema = Joi.object({
  API_GATEWAY_PORT: Joi.number().required().default(3001),
  LOG_LEVEL: Joi.string().required().default("info"),
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .required()
    .default("development"),
  DB_HOST: Joi.string().required().default("localhost"),
  DB_PORT: Joi.string().required().default(5432),
  DB_USER: Joi.string().required().default("postgres"),
  DB_PASS: Joi.string().required().default("postgres"),
  AUTH_DB_NAME: Joi.string().required().default("auth-db"),
});
