const express = require("express");
const router = express.Router();
const axios = require("axios");

const { plb } = require("../functions/parseAPI");
const { checkRank } = require("../functions/rules");

router.get("/:region/leaderboard/:queue/:rank/:page", async (req, res) => {
  // const { region, queue, rank, page } = req.body;
  const { region, queue, rank, page } = req.params;
  console.log(req.params);
  if (!region || !queue || !rank || !page) {
    res.status(422).json({ err: "Missing parameters" });
    return;
  }

  let uRank = rank.toUpperCase();
  !checkRank(uRank) && (uRank = "CHALLENGER");

  try {
    const request = await axios.get(plb(region, queue, uRank, page));
    const players = request.data;
    res.json({ players: players });
  } catch (err) {
    res.status(500).json({ error: err });
    console.log(err);
  }
});

module.exports = router;
