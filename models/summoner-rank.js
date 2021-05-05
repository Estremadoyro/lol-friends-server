const mongoose = require("mongoose");

const SummonerRankSchema = new mongoose.Schema({
  leagueId: {
    type: "String",
  },
  queueType: {
    type: "String",
    enum: ["RANKED_SOLO_5x5", "RANKED_FLEX_SR"],
    required: true,
  },
  league: {
    type: "String",
    default: "Unranked",
    required: true,
  },
  division: {
    type: "String",
  },
  summonerId: {
    type: "String",
    required: true,
  },
  summonerName: {
    type: "String",
    minLength: 3,
    maxLength: 16,
    required: true,
  },
  leaguePoints: {
    type: "Number",
  },
  wins: {
    type: "Number",
  },
  losses: {
    type: "Number",
  },
  veteran: {
    type: "Boolean",
  },
  inactive: {
    type: "Boolean",
  },
  freshBlood: {
    type: "Boolean",
  },
  hotSreak: {
    type: "Boolean",
  },
  region: {
    type: "String",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("summoner.ranks", SummonerRankSchema);
