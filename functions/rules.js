const ranks = ["CHALLENGER", "GRANDMASTER", "MASTER"];

const checkRank = (rank) => {
  return ranks.includes(rank);
};

module.exports = { checkRank };
