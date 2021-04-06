const { selectRegion } = require("../misc/Variables");
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

const regionsValue = selectRegion.regions.map(({ value }) => value);

module.exports = { computeRankStatus, regionsValue };
