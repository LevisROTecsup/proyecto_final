/**
 * Libs
 */
const Config = require("../../config");
const JsonWebToken = require('../libs/json-web-token');

const tokenCustomerDetailConstants = {
  expires: Config.jwt.expires_in,
  algorithm: Config.jwt.algorithm,
}

const tokenAdminDetailConstants = {
  expires: Config.jwt_admin.expires_in,
  algorithm: Config.jwt_admin.algorithm
}

/**
 * Customer token valiation
 */
function isWebUserAuth(req, res, next) {

  const getBearerToken = req.headers["authorization"];

  let token = null;

  try {

    token = getBearerToken.split("Bearer")[1].trim();

  } catch (error) {

    return res.status(401).json({
      status: false,
      message: "La solicitud no se encuentra verificada."
    })
  }

  if (!token) {

    return res.status(401).json({
      status: false,
      message: "La solicitud no se encuentra verificada."
    })
  }

  JsonWebToken.verifyToken(token, tokenCustomerDetailConstants)
    .then(response => {

      req.user = { ...response, user_id: response.sub, token };

      next();

    })
    .catch(error => {

      return res.status(403).json({
        status: false,
        message: "No tiene los permisos necesarios."
      })
    })
}

/**
 * Seller token valiation
 */
function isWebAdminAuth(req, res, next) {

  const getBearerToken = req.headers["adminauthorization"];

  let token = null;

  try {

    token = getBearerToken.split("Bearer")[1].trim();

  } catch (error) {

    return res.status(401).json({
      status: false,
      message: "La solicitud no se encuentra verificada."
    })
  }

  if (!token) {

    return res.status(401).json({
      status: false,
      message: "La solicitud no se encuentra verificada."
    })
  }

  JsonWebToken.verifyToken(token, tokenAdminDetailConstants)
    .then(response => {

      req.user = { ...response, user_id: response.sub, token };


      if (Array.isArray(response.scopes) && response.scopes.includes("admin:basic")) {

        next();

      } else {

        return res.status(401).json({
          status: false,
          message: "No tiene los permisos necesarios."
        })
      }

    })
    .catch(error => {

      console.log("error", error);

      return res.status(403).json({
        status: false,
        message: "No tiene los permisos necesarios."
      })
    })
}

module.exports = { isWebUserAuth, isWebAdminAuth };