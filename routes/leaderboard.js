const express = require("express");
const router = express.Router();

const { checkRank } = require("../functions/rules");

const { leaderboardQueries } = require("../functions/dbQueries");

router.get("/:region/leaderboard/:queue/:rank/:division", async (req, res) => {
  const { region, queue, rank, division } = req.params;
  console.log(req.params);
  if (!region || !queue || !rank || !division) {
    res.status(422).json({ err: "Missing parameters" });
    return;
  }

  let uRank = rank.toUpperCase();
  !checkRank(uRank) && (uRank = "CHALLENGER");

  try {
    const players = await leaderboardQueries(uRank, region, queue, rank);
    res.json({ players: players });
  } catch (err) {
    res.status(500).json({ error: err });
    console.log(err);
  }
});

module.exports = router;
