const { API } = require("../keys");

const plb = (region, queue, rank, division) => {
  const parse = `${API.RIOT_API_LEADERBOARD}/leaderboard/${region}/${queue}/${rank}/${division}`;
  return parse;
};

module.exports = { plb };
