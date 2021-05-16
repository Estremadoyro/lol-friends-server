const numeral = require("numeral");
const { selectRegion, rankedLeague } = require("../misc/Variables");
/**
 * Update player's leaderboard ranking
 *
 * @param {before} - Old leaderboard rank (DB)
 * @param {now} - Current leaderboard rank (API)
 * @returns 'up' | 'down' | 'same' | 'new'
 */
const computeRankStatus = (playerDB, rankAPI) => {
  console.log(`DB rank: ${playerDB.rank}, API rank: ${rankAPI}`);
  if (!playerDB.rank) return "same";
  if (rankAPI > playerDB.rank) return "down";
  else if (rankAPI < playerDB.rank) return "up";
  else return "same";
};

const computeWinrate = (wins, losses) => {
  const wr = Math.round((wins / (wins + losses)) * 100, 0);
  return wr.toString();
};

const getParsedQueue = (queue) => {
  if (queue == "RANKED_SOLO_5x5") return "Solo";
  if (queue == "RANKED_FLEX_SR") return "Flex";
};

const getParsedLeagueDivision = (queueRank) => {
  const league = rankedLeague[queueRank.league];
  if (league.division) return `${league.name} ${queueRank.division}`;
  return league.name;
};

const getHighestLeagueDivision = (queueRank1, queueRank2) => {
  queueRank1.league = queueRank1.league.toUpperCase();
  queueRank2.league = queueRank2.league.toUpperCase();
  const league1 = rankedLeague[queueRank1.league];
  const league2 = rankedLeague[queueRank2.league];
  if (league1.weight > league2.weight) return queueRank1;
  if (league1.weight < league2.weight) return queueRank2;
  if (league1.division <= league2.division) return queueRank1;
  if (league1.division >= league2.division) return queueRank2;
};

const regionsValue = selectRegion.regions.map(({ value }) => value);

const parseMasteryPoints = (points) => {
  return numeral(points).format("0a");
};

module.exports = {
  computeRankStatus,
  regionsValue,
  parseMasteryPoints,
  computeWinrate,
  getParsedQueue,
  getParsedLeagueDivision,
  getHighestLeagueDivision,
};
