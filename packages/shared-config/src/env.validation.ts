import * as Joi from "joi";

export const envValidationSchema = Joi.object({
  API_GATEWAY_PORT: Joi.number().required().default(3001),
  LOG_LEVEL: Joi.string().required().default("info"),
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .required()
    .default("development"),
});
