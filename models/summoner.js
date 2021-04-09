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
  profileIconId: {
    type: "Number",
    default: 29,
  },
  profileIconUrl: {
    type: "String",
    default: "https://cdn.communitydragon.org/11.7.9/profile-icon/29",
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
