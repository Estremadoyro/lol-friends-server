const express = require("express");
const router = express.Router();

const { getPlayerAPI } = require("../../functions/apiQueries");
const { getPlayerDB, createPlayerDB } = require("../../functions/dbQueries");

const { regionsValue } = require("../../functions/misc");

router.post("/:region/:summoner?", async (req, res) => {
  const { region, summoner } = req.params;
  console.log(`${region} || ${summoner}`);
  if (!region || !summoner)
    return res
      .status(400)
      .json({ error: "Summoner or region cannot be empty" });
  if (
    region.length < 2 ||
    region.length > 4 ||
    !regionsValue.includes(region)
  ) {
    console.log(`Invalid region ${region}`);
    return res.status(400).json({ error: "Invalid region" });
  }
  if (summoner.length < 3 || summoner.length > 16) {
    console.log(`Invalid summoner: ${summoner}`);
    return res.status(400).json({ error: "Invalid summoner name" });
  }
  try {
    const player = await getPlayerDB(region, summoner);
    if (player) {
      return res.status(200).json({ player: player });
    }
    const playerAPI = await getPlayerAPI(region, summoner);
    if (playerAPI) {
      const newPlayer = {
        id: playerAPI.id,
        accountId: playerAPI.accountId,
        puuid: playerAPI.puuid,
        region: region,
        name: playerAPI.name,
        profileIconId: playerAPI.profileIconId,
        summonerLevel: playerAPI.summonerLevel,
      };
      const createNewPlayer = await createPlayerDB(newPlayer);
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
