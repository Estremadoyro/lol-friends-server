const express = require("express");
const router = express.Router();

const { getPlayerAPI } = require("../../functions/apiQueries");
const { getPlayerDB, createPlayerDB } = require("../../functions/dbQueries");
const { isRegionAndSummoner } = require("../../middleware/validations");

router.get("/:region/:summoner?", isRegionAndSummoner, async (req, res) => {
  const { region, summoner } = req.params;
  console.log(`${region} || ${summoner}`);
  try {
    const player = await getPlayerDB(region, summoner);
    return res.status(200).json({ player: player });
  } catch (error) {
    console.log(error);
  }
});

router.post("/:region/:summoner?", isRegionAndSummoner, async (req, res) => {
  const { region, summoner } = req.params;
  try {
    const playerAPI = await getPlayerAPI(region, summoner);
    if (playerAPI) {
      const createNewPlayer = await createPlayerDB(playerAPI, region);
      res.status(200).json({ player: createNewPlayer });
      return createNewPlayer;
    }
    console.log("player doesnt exist");
    return res.status(404).json({ error: "Player doesn't exist " });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
    console.log(err);
  }
});
module.exports = router;
