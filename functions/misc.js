/**
 * Update player's leaderboard ranking
 *
 * @param {before} - Old leaderboard rank (DB)
 * @param {now} - Current leaderboard rank (API)
 * @returns 'up' | 'down' | 'same' | 'new'
 */
const computeRankStatus = (before, now) => {
  if (!before.rank) return "same";
  if (now.rank > before.rank) return "up";
  else if (now.rank < before.rank) return "down";
  else return "same";
};

module.exports = { computeRankStatus };
