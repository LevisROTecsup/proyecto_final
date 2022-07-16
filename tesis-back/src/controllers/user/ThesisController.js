const path = require("path");
const dayjs = require("dayjs");
const fs = require("fs").promises;

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

module.exports = {
  getThesis: async (req, res) => {

    const getThesisData = await ThesisModel.find({ type: "PUBLIC" })

    return res.status(200).json({ status: true, message: "Ok", data: { thesis: getThesisData } });
  },
  getShowThesis: async (req, res) => {

    const { thesisId: requestThesisId } = req.params;

    const getThesisData = await ThesisModel.findOne({ _id: requestThesisId, type: "PUBLIC" });

    if (!getThesisData) {

      return res.status(400).json({
        status: false,
        message: "No se encontró el elemento que intenta buscar."
      })
    }

    return res.status(200).json({ status: true, message: "Ok", data: { thesis: getThesisData } });
  },
  reviewThesis: async (req, res) => {

    const { user_id } = req.user;
    const { rate: requestThesisRate } = req.body;
    const { thesisId: requestThesisId } = req.params;

    const ratingInfo = {
      user: user_id,
      rating: requestThesisRate
    }

    const getThesisData = await ThesisModel.findById(requestThesisId);

    if (!getThesisData) {

      return res.status(400).json({
        status: false,
        message: "No se encontró el elemento que intenta buscar."
      })
    }

    const isReviewed = getThesisData.reviews.find(
      (rev) => rev.user.toString() === ratingInfo.user
    );

    if (isReviewed) {

      getThesisData.reviews.forEach((rev) => {
        if (rev.user.toString() === ratingInfo.user)
          (rev.rating = ratingInfo.rating);
      });
    } else {

      getThesisData.reviews.push(ratingInfo);
      getThesisData.num_reviews = getThesisData.reviews.length;
    }

    let avg = 0;

    getThesisData.reviews.forEach((rev) => {
      avg += rev.rating;
    });

    getThesisData.ratings = avg / getThesisData.reviews.length;

    await getThesisData.save();

    try {

      await getThesisData.save({ validateBeforeSave: false });

    } catch (error) {
      console.log("files", error);
      return res.status(500).json({ status: false, message: "Lo sentimos se ha producido un error, inténtenlo nuevamente." })
    }

    return res.status(201).json({ status: true, message: "Ok", data: { rating: avg } })
  },
  getDownloadFile: async (req, res) => {

    const { fileId: requestFileId } = req.params;

    let base64File = null;

    try {

      const pathFile = path.join(__dirname, `../../public/thesis/${requestFileId}`);
      base64File = await fs.readFile(pathFile, { encoding: "base64" })

    } catch (error) {
      console.log("get files", error);
      return res.status(500).json({
        status: false,
        message: "Lo sentimos se ha producido un error, inténtenlo nuevamente."
      })
    }

    if (!base64File) {

      return res.status(400).json({
        status: false,
        message: "Lo sentimos no se encontró el archivo que intenta descargar."
      })
    }

    return res.status(200).json({
      status: true,
      message: "Ok",
      data: { file: base64File }
    })

  },
  searchThesis: async (req, res) => {

    const { q } = req.query

    let thesisFound = null

    try {

      let query = q.toLowerCase()

      let regex = new RegExp(query, 'i');

      thesisFound = await ThesisModel.find({
        $or: [
          { title: regex },
          { theme: regex },
          { contents: { $all: [regex] } },
          { key_words: { $all: [regex] } },
          { authors: { $all: [regex] } },
        ]
      })

    } catch (error) {

      return res.status(500).json({
        status: false,
        message: "Lo sentimos se ha producido un error, inténtenlo nuevamente."
      })
    }

    return res.status(200).json({
      status: true,
      message: "Ok",
      data: { thesis: thesisFound }
    })
  }
}