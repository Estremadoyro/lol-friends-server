const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");

const { getPlayerAPI } = require("../../functions/apiQueries");
const { getPlayerDB, createPlayerDB } = require("../../functions/dbQueries");

router.post("/:region/:summoner", async (req, res) => {
  const { region, summoner } = req.params;
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
    return res.status(404).json({ error: "Player doesn't exist :sadowo:" });
  } catch (err) {
    res.json({ msg: "No player :sadowo:" });
    console.log(err);
  }
});

module.exports = router;
