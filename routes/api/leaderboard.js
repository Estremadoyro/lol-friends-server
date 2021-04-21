const express = require("express");
const router = express.Router();

const { checkLeague } = require("../../functions/rules");

const { getLeaderboardPlayers } = require("../../functions/dbQueries");

router.get("/:region/:league", async (req, res) => {
  const { region, league } = req.params;
  const { page } = req.query;
  const queue = "RANKED_SOLO_5x5";
  const division = "I";
  console.log(req.params);
  if (!region || !queue || !league || league == "undefined" || !division) {
    console.log(`region or league not selected`);
    res.status(400).json({ error: "Region or league not selected" });
    return;
  }

  let uLeague = league.toUpperCase();
  !checkLeague(uLeague) && (uLeague = "CHALLENGER");

  try {
    const { players, pages } = await getLeaderboardPlayers(
      uLeague,
      region,
      queue,
      page
    );
    res.json({ players, pages });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
    console.log(err);
  }
});

module.exports = router;
