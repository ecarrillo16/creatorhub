import * as Joi from 'joi';

export const envVarsSchema = Joi.object({
  // Definimos que DATABASE_URL es obligatoria y debe ser una cadena
  DATABASE_URL: Joi.string().required().messages({
    'any.required':
      'La variable de entorno DATABASE_URL es obligatoria para la conexión a la base de datos.',
  }),

  // Podemos validar otros valores, como el puerto
  PORT: Joi.number().default(3000),

  // Validar el entorno (producción, desarrollo, etc.)
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
});
