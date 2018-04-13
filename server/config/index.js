const config = {
  ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3001,
  DB_URI: process.env.DB_URI || "mongodb://localhost:27017",
  DB_NAME: process.env.DB_NAME || "crytoklout",
  LOG_LEVEL: process.env.LOG_LEVEL || "dev",
  SALT_ROUNDS: process.env.SALT_ROUNDS || 10,
};

module.exports = config;

/**
 * Create the environment schema - saving this for later
 */

// const defaultEnv = {
//   port: 3001,
//   db_uri: "mongodb://localhost:27017",
//   db_name: "cryptoklout",
//   db_reconnect_tries: 30,
//   db_reconnect_interval: 1000,
//   log_level: "dev",
//   saltRounds: 10
// };
// const envVarsSchema = joi
//   .object({
//     PORT: joi.number().default(defaultEnv.port),
//     NODE_ENV: joi.string().valid(["local", "development", "production"]).required(),
//     LOG_LEVEL: joi.string().valid(["dev"]).default(defaultEnv.log_level),
//     DB_URI: joi.string().default(defaultEnv.dbURI),
//     DB_NAME: joi.string().default(defaultEnv.dbName),
//     SALT_ROUNDS: joi.string().valid([8, 10, 12]).default(defaultEnv.saltRounds),
//   })
//   .unknown() // allow variables not defined here
//   .required(); // require the tested object, in this case process.env

// console.log(process.env);

// validate process.env
// const { error, value: env } = joi.validate(process.env, envVarsSchema);
// if (error) throw new Error(`Config validation error: ${error.message}`);
