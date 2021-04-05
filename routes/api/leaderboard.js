const express = require("express");
const router = express.Router();

const { checkRank } = require("../../functions/rules");

const { getLeaderboardPlayers } = require("../../functions/dbQueries");

router.get("/:region/:league", async (req, res) => {
  const { region, league } = req.params;
  const queue = "RANKED_SOLO_5x5";
  const division = "I";
  console.log(req.params);
  if (!region || !queue || !league || !division) {
    res.status(422).json({ err: "Missing parameters" });
    return;
  }

  let uLeague = league.toUpperCase();
  !checkRank(uLeague) && (uLeague = "CHALLENGER");

  try {
    const players = await getLeaderboardPlayers(uLeague, region, queue, league);
    res.json({ players: players });
  } catch (err) {
    res.status(500).json({ error: err });
    console.log(err);
  }
});

module.exports = router;
