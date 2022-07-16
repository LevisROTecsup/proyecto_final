const dayjs = require("dayjs");

const utc = require('dayjs/plugin/utc')
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Models
 */
const ThesisModel = require("../../models/Thesis");

/**
 * Libs
 */
const { uploadFile, deleteFile } = require("../../libs/upload-file");

module.exports = {
  getThesis: async (req, res) => {

    const getThesisData = await ThesisModel.find({})

    return res.status(200).json({ status: true, message: "Ok", data: { thesis: getThesisData } });
  },
  createThesis: async (req, res) => {

    const requestThesisFile = req.files;
    const {
      title: requestThesisTitle,
      theme: requestThesisTheme,
      contents: requestThesisContents,
      key_words: requestThesisKeyWords,
      authors: requestThesisAuthors,
      type: requestThesisType = "PUBLIC"
    } = req.body;

    let fileInfo = null;

    try {

      fileInfo = await uploadFile(
        requestThesisFile.file,
        "thesis",
        {
          allowExtensions: ["pdf", "doc", "docx"],
        }
      );

    } catch (error) {
      fileInfo = error;
    }

    try {

      const thesisInfo = new ThesisModel({
        title: requestThesisTitle,
        theme: requestThesisTheme,
        contents: JSON.parse(requestThesisContents),
        key_words: JSON.parse(requestThesisKeyWords),
        authors: JSON.parse(requestThesisAuthors),
        file: {
          uuid: fileInfo.file,
          mimetype: fileInfo.details.mimetype,
          extension: fileInfo.details.extension
        },
        type: requestThesisType.toUpperCase()
      })

      await thesisInfo.save();

    } catch (error) {
      console.log("files", error);
      return res.status(500).json({ status: false, message: "Lo sentimos se ha producido un error, inténtenlo nuevamente." })
    }

    return res.status(201).json({ status: true, message: "Ok", data: {} })
  },
  getShowThesis: async (req, res) => {

    const { thesisId: requestThesisId } = req.params;

    const getThesisData = await ThesisModel.findById(requestThesisId);

    if (!getThesisData) {

      return res.status(400).json({
        status: false,
        message: "No se encontró el elemento que intenta buscar."
      })
    }

    return res.status(200).json({ status: true, message: "Ok", data: { thesis: getThesisData } });
  },
  updateThesis: async (req, res) => {

    const { thesisId: requestThesisId } = req.params;
    const {
      title: requestThesisTitle,
      theme: requestThesisTheme,
      contents: requestThesisContents,
      key_words: requestThesisKeyWords,
      authors: requestThesisAuthors,
      type: requestThesisType
    } = req.body;

    try {

      await ThesisModel.findByIdAndUpdate(requestThesisId, {
        title: requestThesisTitle,
        theme: requestThesisTheme,
        contents: JSON.parse(requestThesisContents),
        key_words: JSON.parse(requestThesisKeyWords),
        authors: JSON.parse(requestThesisAuthors),
        type: requestThesisType.toUpperCase()
      })

    } catch (error) {
      console.log("files", error);
      return res.status(500).json({ status: false, message: "Lo sentimos se ha producido un error, inténtenlo nuevamente." })
    }

    return res.status(200).json({ status: true, message: "Ok", data: {} })
  },
  updateThesisFile: async (req, res) => {

    const requestThesisFile = req.files;
    const { thesisId: requestThesisId } = req.params;

    const getThesisData = await ThesisModel.findById(requestThesisId);

    if (!getThesisData) {

      return res.status(400).json({
        status: false,
        message: "No se encontró el elemento que intenta buscar."
      })
    }

    let fileInfo = null;

    try {

      fileInfo = await uploadFile(
        requestThesisFile.file,
        "thesis",
        {
          allowExtensions: ["pdf", "doc", "docx"],
        }
      );

    } catch (error) {
      fileInfo = error;
    }

    if (fileInfo.status) {

      let deleteInfo = null;

      try {

        deleteInfo = await deleteFile(getThesisData.file.uuid, "thesis")

      } catch (error) {
        deleteInfo = error
      }

      console.log("status delete banner image", deleteInfo.status);

    }

    const fileUploaded = {
      uuid: fileInfo.file,
      mimetype: fileInfo.details.mimetype,
      extension: fileInfo.details.extension
    }

    try {

      await ThesisModel.findByIdAndUpdate(requestThesisId, {
        file: fileUploaded
      })

    } catch (error) {
      console.log("update", error);
      return res.status(500).json({ status: false, message: "Lo sentimos se ha producido un error, inténtenlo nuevamente." })
    }

    return res.status(200).json({ status: true, message: "Ok", data: { file: fileUploaded } })
  },
  deleteThesis: async (req, res) => {

    const { thesisId: requestThesisId } = req.params;

    const getThesisData = await ThesisModel.findById(requestThesisId);

    if (!getThesisData) {

      return res.status(400).json({
        status: false,
        message: "No se encontró el elemento que intenta buscar."
      })
    }

    if (getThesisData.file) {

      let deleteInfo = null;

      try {

        deleteInfo = await deleteFile(getThesisData.file.uuid, "thesis")

      } catch (error) {
        deleteInfo = error
      }

      console.log("status delete banner image", deleteInfo.status);

    }

    try {

      await ThesisModel.findByIdAndDelete(requestThesisId)

    } catch (error) {
      console.log("delete", error);
      return res.status(500).json({ status: false, message: "Lo sentimos se ha producido un error, inténtenlo nuevamente." })
    }

    return res.status(200).json({ status: true, message: "Ok", data: {} })
  }
}