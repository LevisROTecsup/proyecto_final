const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

function uploadFile(file, dirFolder, { allowExtensions = ["png", "jpg", "jpeg"] } = {}) {

  return new Promise((resolve, reject) => {

    const splitName = file.name.split(".");
    const extension = splitName[splitName.length - 1];

    // Validar la extension
    if (!allowExtensions.includes(extension)) {
      return reject({
        status: false,
        file: {
          details: JSON.stringify({ error: `La extensión ${extension} no es permitida - ${allowExtensions}` })
        }
      });
    }

    const nameTemp = uuidv4() + "." + extension;

    const uploadPath = path.join(__dirname, "../../public/", dirFolder, nameTemp);

    file.mv(uploadPath, (err) => {
      if (err) {
        reject({
          status: false,
          file: null
        });
      }

      resolve({
        status: true,
        file: `${nameTemp}`,
        details: {
          mimetype: file.mimetype,
          extension: extension
        }
      });
    });

  });

}

function deleteFile(file, dirFolder) {

  return new Promise((resolve, reject) => {

    const deletePath = path.join(__dirname, "../../public/", dirFolder, file)

    fs.unlink(deletePath, function (error) {
      if (error) {
        reject({
          status: false,
          message: err
        });
      }

      resolve({
        status: true,
        message: "OK"
      });
    })

  })

}

module.exports = {
  uploadFile,
  deleteFile
}