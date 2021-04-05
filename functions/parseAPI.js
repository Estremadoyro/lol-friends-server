const { API } = require("../keys");

const plb = (region, queue, rank, division) => {
  const parse = `${API.RIOT_API_LEADERBOARD}/leaderboard/${region}/${queue}/${rank}/${division}`;
  return parse;
};

const pSummoner = (region, summoner) => {
  const parse = `${API.RIOT_API_SUMMONER_BASIC_INFO}/summoner/${region}/${summoner}`;
  return parse;
};

module.exports = { plb, pSummoner };
