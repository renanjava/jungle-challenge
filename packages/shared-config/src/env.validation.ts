import * as Joi from "joi";

export const envValidationSchema = Joi.object({
  API_GATEWAY_PORT: Joi.number().required().default(3001),
  LOG_LEVEL: Joi.string().required().default("info"),
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .required()
    .default("development"),
  JWT_ACCESS_SECRET: Joi.string().required().default("cafecomleite1"),
  JWT_REFRESH_SECRET: Joi.string().required().default("cafecomleite2"),
  DB_HOST: Joi.string().required().default("localhost"),
  DB_PORT: Joi.string().required().default(5432),
  DB_USER: Joi.string().required().default("postgres"),
  DB_PASS: Joi.string().required().default("postgres"),
  AUTH_DB_NAME: Joi.string().required().default("auth_db"),
  TASKS_DB_NAME: Joi.string().required().default("tasks_db"),
  RABBITMQ_URL: Joi.string().required().default("amqp://localhost:5672"),
});
