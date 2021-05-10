const mongoose = require("mongoose");

const SummonerSchema = new mongoose.Schema({
  id: {
    type: "String",
    unique: true,
    required: true,
  },
  accountId: {
    type: "String",
    unique: true,
    required: true,
  },
  puuid: {
    type: "String",
    unique: true,
    required: true,
  },
  region: {
    type: "String",
    required: true,
  },
  name: {
    minLength: 3,
    maxLength: 16,
    type: "String",
    required: true,
  },
  nameLower: {
    minLength: 3,
    maxLength: 16,
    type: "String",
    required: true,
  },
  profileIconId: {
    type: "Number",
    default: 29,
  },
  profileIconUrl: {
    type: "String",
    default:
      "https://ddragon.leagueoflegends.com/cdn/11.9.1/img/profileicon/29.png",
  },
  summonerLevel: {
    type: "Number",
    required: true,
  },
  isRanked: {
    type: "Boolean",
    default: false,
    required: true,
  },
  isRankedSolo: {
    type: "Boolean",
    default: false,
    required: true,
  },
  isRankedFlex: {
    type: "Boolean",
    default: false,
    required: true,
  },
  championMastery: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "summoner.masteries",
    },
  ],
  highestLeague: {
    type: "String",
    default: "Unranked",
  },
  summonerRank: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "summoner.ranks",
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("summoner", SummonerSchema);
