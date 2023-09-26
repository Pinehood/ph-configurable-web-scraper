import * as Joi from "joi";

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().required().default("development"),
  SWAGGER_USE_METADATA_FILE: Joi.string().required().default(true),
});
