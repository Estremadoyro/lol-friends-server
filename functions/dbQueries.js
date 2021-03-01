const RankChallenger = require("../models/rank-challenger");
const RankGrandMaster = require("../models/rank-grandmaster");
const RankMaster = require("../models/rank-master");

const pickModel = (leaderboard) => {
  let model;
  switch (leaderboard) {
    //CHALLENGER
    case "CHALLENGER":
      model = RankChallenger;
      break;
    //GRANDMASTER
    case "GRANDMASTER":
      model = RankGrandMaster;
      break;
    //MASTER
    default:
      model = RankMaster;
      break;
  }
  return model;
};

const leaderboardQueries = async (leaderboard, region, queue, rank) => {
  const model = pickModel(leaderboard);
  const players = await model
    .find({
      region: region,
      queue: queue,
      queueRank: rank,
    })
    .sort({ rank: 1 });
  return players;
};

const findPlayer = async (rank, summonerId) => {
  const Model = pickModel(rank);
  try {
    const player = await Model.findOne({ summonerId: summonerId });
    if (player) {
      return player;
    } else {
      console.log(`Player ${summonerId} doesn't exist`);
    }
  } catch (err) {
    console.log(err);
  }
};

// const db = require('../db');

// db();
// const player = findPlayer('MASTER', 'PI8DbpZ4mxQiT_on4FefzVTgwds5tIbX9nT_GQrLe8h9mg');
// console.log(player);

module.exports = { leaderboardQueries, pickModel, findPlayer };
