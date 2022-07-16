const dotenv = require('dotenv');
const parseToBool = require('../src/libs/parse/toBoolean');

dotenv.config();

module.exports = {
  /**
   * General config
   */
  port: parseInt(process.env.PORT, 10),
  development_mode: process.env.NODE_ENV === 'development' ? true : false,
  /**
   * That long string from mlab
   */
  mongo_uri: process.env.DATABASE_URI,
  /**
   * JWT config
   */
  jwt: {
    algorithm: process.env.JWT_USER_ALGO || 'RS256',
    secret: process.env.JWT_USER_SECRET || 'secretkey@',
    expires_in: process.env.JWT_USER_TOKEN_EXPIRES || '24h'
  },
  /**
   * JWT config seller
   */
  jwt_admin: {
    algorithm: process.env.JWT_ADMIN_ALGO || 'RS256',
    expires_in: process.env.JWT_ADMIN_TOKEN_EXPIRES || '24h',
    secret: process.env.JWT_ADMIN_SECRET || 'secretkweyadmin@',
  },
  /**
   * Email credentials
   */
  hex_encrypt: {
    user: process.env.HEX_ID,
    admin: process.env.HEX_ADMIN_ID
  },
  /**
   * Email credentials
   */
  mail: {
    user: process.env.MAIL_USER,
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_SECURE,
    password: process.env.MAIL_PASSWORD,
    from_address: process.env.MAIL_FROM_ADDRESS
  },
  /**
   * API configs
   */
  api: {
    prefix: '/api/'
  },
  /**
   * Allowed origins
   */
  // allowed_origins: [
  //   ...process.env.ALLOWED_ORIGINS.split(",")
  // ],
  /**
   * Allowed domain cookie
   */
  // cookie_allowed_origin: process.env.COOKIE_ALLOWED_ORIGIN,
  /**
   * Secret cookie
   */
  // cookie_secret: process.env.COOKIE_SECRET,
  /**
   * Cors credentials
   */
  // with_cors_credentials: parseToBool(process.env.WITH_CORS_CREDENTIALS) || false
}