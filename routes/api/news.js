const express = require("express");
const router = express.Router();

const { findNews } = require("../../functions/dbQueries");

router.get("/", async (req, res) => {
  try {
    const news = await findNews();
    res.status(200).json(news);
    return news;
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
