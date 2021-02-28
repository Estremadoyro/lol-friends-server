const mongoose = require("mongoose");

const RankChallengerSchema = new mongoose.Schema({
  summonerId: {
    type: String,
    unique: true,
    required: true,
  },
  region: {
    type: String,
    require: true,
  },
  rank: {
    type: Number,
    unique: true,
    required: true,
  },
  rankOffset: {
    type: Number,
    default: 0,
    required: true,
  },
  queueRank: {
    type: String,
    enum: ["CHALLENGER", "GRANDMASTER", "MASTER"],
    default: "CHALLENGER",
    required: true,
  },
  summonerName: {
    type: String,
    min: 3,
    max: 16,
    required: true,
  },
  leaguePoints: {
    type: Number,
    required: true,
  },
  queue: {
    type: String,
    required: true,
  },
  wins: {
    type: Number,
    required: true,
  },
  losses: {
    type: Number,
    required: true,
  },
  rankUpdate: {
    type: String,
    enum: ["up", "down", "same", "new"],
    default: "same",
    required: true,
  },
});

module.exports = mongoose.model(
  "RANK_LEADERBOARD_CHALLENGER",
  RankChallengerSchema
);
