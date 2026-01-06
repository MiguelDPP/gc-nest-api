import * as Joi from 'joi';

export const EnvConfiguration = () => {
  return {
    stage: process.env.STAGE,
    db_password: process.env.DB_PASSWORD,
    db_name: process.env.DB_NAME,
    db_host: process.env.DB_HOST,
    db_port: Number(process.env.DB_PORT) || 5432,
    db_user: process.env.DB_USER,
    jwt_secret: process.env.JWT_SECRET,

    port: Number(process.env.PORT) || 3000,
  };
};

export const JoiValidationEnvSchema = Joi.object({
  STAGE: Joi.required().valid('dev', 'prod', 'test', 'local'),
  DB_PASSWORD: Joi.required(),
  DB_NAME: Joi.required(),
  DB_HOST: Joi.required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.required(),

  JWT_SECRET: Joi.string().required(),

  PORT: Joi.number().default(3000),
});
