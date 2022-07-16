const dayjs = require("dayjs");
const bcrypt = require("bcryptjs");

const utc = require('dayjs/plugin/utc')
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Libs
 */
const Config = require("../../../config");
const UserModel = require("../../models/User");
const JsonWebToken = require("../../libs/json-web-token");

const tokenDetailConstants = {
  algorithm: Config.jwt_admin.algorithm,
  expires: Config.jwt_admin.expires_in
}

module.exports = {
  login: async (req, res) => {

    const { email: requestEmail, password: requestPassword } = req.body;

    let userData = null;

    try {

      userData = await UserModel.findOne({
        email: requestEmail,
        is_admin: true
      })

      if (!userData) {

        return res.status(400).json({
          status: false,
          message: "Credenciales incorrectas."
        })
      }

      let checkPassword = await UserModel.checkPassword(requestPassword, userData.password);

      if (!checkPassword) {

        return res.status(400).json({
          status: false,
          message: "Credenciales incorrectas."
        })
      }

    } catch (error) {

      return res.status(500).json({
        status: false,
        message: "Lo sentimos se ha producido un error, inténtenlo nuevamente."
      })
    }

    const userResponse = {
      name: userData.name,
      email: userData.email
    }

    const tokenInfo = {
      dataId: userData.id.toString()
    }

    const token = JsonWebToken.createToken(tokenInfo, ["admin:basic"], tokenDetailConstants);

    return res.status(200).json({
      status: true,
      message: "Ok",
      data: {
        user: userResponse,
        token
      }
    });
  },
  me: async (req, res) => {

    const { user_id: requestAdminId, exp: requestExp, token } = req.user;

    let adminData = null;

    try {

      adminData = await UserModel.findById(requestAdminId);

    } catch (error) {

      return res.status(500).json({
        status: false,
        message: "Lo sentimos se ha producido un error, inténtenlo nuevamente."
      })
    }

    return res.status(200).json({
      status: true,
      message: "Ok",
      data: {
        user: { name: adminData.name, email: adminData.email, token },
        token: { exp: requestExp }
      }
    })
  },
  register: async (req, res) => {

    const {
      name: requestName,
      email: requestEmail,
      password: requestPassword
    } = req.body;

    const userRegistered = await UserModel.findOne({
      email: requestEmail
    })

    if (userRegistered) {

      return res.status(419).json({
        status: false,
        message: "El usuario ya se encuenta registrado."
      });
    }

    try {

      const passwordGenerated = await UserModel.hashPassword(requestPassword);

      const userInfo = new UserModel({
        name: requestName,
        email: requestEmail,
        password: passwordGenerated,
        is_admin: true
      })

      await userInfo.save();

    } catch (error) {

      return res.status(500).json({
        status: false,
        message: "Lo sentimos se ha producido un error, inténtenlo nuevamente."
      });
    }

    return res.status(200).json({
      status: true,
      message: "Ok",
      data: {}
    });
  }
}