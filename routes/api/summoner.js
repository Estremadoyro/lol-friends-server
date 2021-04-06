const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { param, check, validationResult } = require("express-validator");

const { getPlayerAPI } = require("../../functions/apiQueries");
const { getPlayerDB, createPlayerDB } = require("../../functions/dbQueries");

const { regionsValue } = require("../../functions/misc");

router.post(
  "/:region/:summoner",
  [
    param(["region", "Invalid region"]).isIn(regionsValue),
    param(["summoner", "Invalid summoner name"]).isLength({ min: 3, max: 16 }),
  ],
  async (req, res) => {
    const { region, summoner } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      res.status(400).json({ errors: errors.array() });
      return;
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
      return res
        .status(404)
        .json({ errors: [{ msg: "Player doesn't exist :sadowo:" }] });
    } catch (err) {
      res.status(500).json({ errors: [{ msg: "Server error :sadowo:" }] });
      console.log(err);
    }
  }
);

module.exports = router;
