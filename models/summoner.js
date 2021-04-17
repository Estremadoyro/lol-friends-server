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
      "https://ddragon.leagueoflegends.com/cdn/11.8.1/img/profileicon/29.png",
  },
  summonerLevel: {
    type: "Number",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SUMMONER", SummonerSchema);
