const mongoose = require("mongoose");

const SummonerMasterySchema = new mongoose.Schema({
  championId: {
    type: "Number",
    required: true,
    default: 10,
  },
  championIconUrl: {
    type: "String",
    required: true,
    default: "https://cdn.communitydragon.org/11.9.9/champion/1/square",
  },
  championLevel: {
    type: "Number",
  },
  championPoints: {
    type: "Number",
  },
  championPointsFormated: {
    type: "String",
  },
  lastPlayTime: {
    type: "Number",
  },
  championPointsSinceLastLevel: {
    type: "Number",
  },
  championPointsUntilNextLevel: {
    type: "Number",
  },
  chestGranted: {
    type: "Boolean",
    default: false,
    required: true,
  },
  tokensEarned: {
    type: "Number",
    default: 0,
  },
  summonerId: {
    type: "String",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("summoner.masteries", SummonerMasterySchema);
