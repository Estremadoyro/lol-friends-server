const {
  getHighestLeagueDivision,
  getParsedLeagueDivision,
  computeWinrate,
  getParsedQueue,
} = require("../functions/misc");

const queueRank1 = { league: "PLATINUM", division: "I" };
const queueRank2 = { league: "MASTER", division: "I" };

const exec = getHighestLeagueDivision(queueRank1, queueRank2);
const exec2 = getParsedLeagueDivision(exec);

const exec3 = computeWinrate(100, 23);
const exec4 = getParsedQueue("RANKED_SOLO_5x5");

console.log(exec2);
console.log(exec3);
console.log(exec4);
