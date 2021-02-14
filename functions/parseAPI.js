const { API } = require("../keys");

const plb = (region, queue, rank, page) => {
  const parse = `${API.RIOT_API_LEADERBOARD}/leaderboard/${region}/${queue}/${rank}/${page}`;
  return parse;
};

module.exports = { plb };
