require("dotenv").config();

const API = {
  RIOT_API_LEADERBOARD: process.env.RIOT_API_LEADERBOARD,
  RIOT_API_SUMMONER_BASIC_INFO: process.env.RIOT_API_SUMMONER_BASIC_INFO,
  RIOT_API_SUMMONER_RANK_INFO: process.env.RIOT_API_SUMMONER_RANK_INFO,
};

const MONGO_CREDENTIALS = {
  DB_URI: process.env.DB_URI,
}
module.exports = { API, MONGO_CREDENTIALS };
