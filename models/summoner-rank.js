const mongoose = require("mongoose");

const SummonerRankSchema = new mongoose.Schema({
  leagueId: {
    type: "String",
  },
  queue: {
    type: "String",
    enum: ["Solo", "Flex"],
    required: true,
  },
  queueType: {
    type: "String",
    enum: ["RANKED_SOLO_5x5", "RANKED_FLEX_SR"],
    required: true,
  },
  league: {
    type: "String",
    default: "unranked",
    required: "true",
  },
  division: {
    type: "String",
  },
  leagueDivision: {
    type: "String",
    required: true,
    default: "Unranked",
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
    default: 0,
    required: true,
  },
  wins: {
    type: "Number",
  },
  losses: {
    type: "Number",
  },
  winRate: {
    type: "String",
    default: "-",
  },
  isRanked: {
    type: "Boolean",
    default: false,
    required: true,
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
  promos: {
    isInPromo: {
      type: "Boolean",
      required: true,
    },
    target: {
      type: "Number",
    },
    wins: {
      type: "Number",
    },
    losses: {
      type: "Number",
    },
    progress: {
      type: "String",
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("summoner.ranks", SummonerRankSchema);
