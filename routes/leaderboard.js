const express = require("express");
const router = express.Router();

const { checkRank } = require("../functions/rules");

const { getLeaderboardPlayers } = require("../functions/dbQueries");

router.get(
  "/:region/leaderboard/:queue/:league/:division",
  async (req, res) => {
    const { region, queue, league, division } = req.params;
    console.log(req.params);
    if (!region || !queue || !league || !division) {
      res.status(422).json({ err: "Missing parameters" });
      return;
    }

    let uLeague = league.toUpperCase();
    !checkRank(uLeague) && (uLeague = "CHALLENGER");

    try {
      const players = await getLeaderboardPlayers(
        uLeague,
        region,
        queue,
        league
      );
      res.json({ players: players });
    } catch (err) {
      res.status(500).json({ error: err });
      console.log(err);
    }
  }
);

module.exports = router;
