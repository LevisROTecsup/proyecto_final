const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

/**
 * Key for web
 */
const publicKey = fs.readFileSync(path.join(__dirname, "/../../../keys/publicKey.key"), "utf8");
const privateKey = fs.readFileSync(path.join(__dirname, "/../../../keys/privateKey.key"), "utf8");

function createToken({ dataId }, scopes, { expires, algorithm } = {}) {

  const payload = {
    sub: dataId,
    scopes: scopes
  }

  const signOptions = {
    expiresIn: expires,
    algorithm: algorithm
  }

  const token = jwt.sign(payload, privateKey, signOptions)

  return token;
}

function verifyToken(token, { expires, algorithm } = {}) {

  const verifyOptions = {
    expiresIn: expires,
    algorithm: algorithm
  }

  const decoded = new Promise((resolve, reject) => {
    try {

      const payload = jwt.verify(token, publicKey, verifyOptions);
      resolve(payload);

    }
    catch (error) {
      reject(error.message);
    }
  })

  return decoded;
}

module.exports = {
  createToken,
  verifyToken
}