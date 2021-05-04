const { API } = require("../keys");

const plb = (region, queue, rank, division) => {
  const parse = `${API.RIOT_API_LEADERBOARD}/leaderboard/${region}/${queue}/${rank}/${division}`;
  const parseEncoded = encodeURI(parse);
  return parseEncoded;
};

const pSummoner = (region, summoner) => {
  const parse = `${API.RIOT_API_SUMMONER_BASIC_INFO}/summoner/${region}/${summoner}`;
  const parseEncoded = encodeURI(parse);
  return parseEncoded;
};

const pSummonerMasteryChampions = (region, summonerId) => {
  const parse = `${API.RIOT_API_SUMMONER_MASTERY_CHAMPIONS}/summoner/mastery/${region}/${summonerId}`;
  const parseEncoded = encodeURI(parse);
  return parseEncoded;
};

module.exports = { plb, pSummoner, pSummonerMasteryChampions };
