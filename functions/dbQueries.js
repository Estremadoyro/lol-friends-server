const RankChallenger = require("../models/rank-challenger");
const RankGrandMaster = require("../models/rank-grandmaster");
const RankMaster = require("../models/rank-master");

/**
 * Returns a ranked league model
 * @param {league} - Ranked system league
 * @returns RankChallenger | RankGrandmaster | RankMaster
 */
const pickModel = (league) => {
  let model;
  switch (league) {
    case "CHALLENGER":
      model = RankChallenger;
      break;
    case "GRANDMASTER":
      model = RankGrandMaster;
      break;
    default:
      model = RankMaster;
      break;
  }
  return model;
};

/**
 * Finds all players of a League (Challenger, Grandmaster, Master)
 * @param {league} - Ranked system league
 * @param {region} - Ranked region (9 regions)
 * @param {queue} - Ranked queue (RANKED_SOLO_5x5, RANKED_FLEX_5x5)
 * @returns RankChallenger | RankGrandmaster | RankMaster
 */
const getLeaderboardPlayers = async (league, region, queue) => {
  const model = pickModel(league);
  try {
    const players = await model
      .find({
        region: region,
        queue: queue,
        league: league,
      })
      .sort({ rank: 1 });
    return players;
  } catch (err) {
    console.log(err);
  }
};
/**
 * Find a specific player by summonerId
 * @param {league} - Ranked system league
 * @param {summonerId} - Player unique summoner id
 * @returns Player
 */
const findPlayer = async (league, summonerId) => {
  const Model = pickModel(league);
  try {
    const player = await Model.findOne({ summonerId: summonerId });
    return player;
  } catch (err) {
    console.log(err);
  }
};

/**
 * Create a new DB player from API data
 * @param {playerAPI} - Player from RIOT's API
 * @param {model} - Player model
 * @param {rank} - Player leaderboard rank
 * @param {region} - Ranked region (9 regions)
 * @param {updatedTime} - Update timestamp
 * @returns new Player
 */
const createPlayer = async (playerAPI, league, region, rank, updatedTime) => {
  const model = pickModel(league);
  const newPlayer = new model({
    rank: rank,
    region: region,
    summonerId: playerAPI.summonerId,
    league: playerAPI.tier,
    summonerName: playerAPI.summonerName,
    leaguePoints: playerAPI.leaguePoints,
    queue: playerAPI.queueType,
    wins: playerAPI.wins,
    losses: playerAPI.losses,
    rankUpdate: "new",
    updateTime: updatedTime,
  });
  try {
    const response = await newPlayer.save();
    return response;
  } catch (err) {
    console.log(err);
  }
};

/**
 * Create a new DB player from API data
 * @param {playerAPI} - Player from RIOT's API
 * @param {model} - Player model
 * @param {rank} - Player leaderboard rank
 * @param {region} - Ranked region (9 regions)
 * @param {updatedTime} - Update timestamp
 * @returns new Player
 */
const updateLeaderboardPlayer = async (
  playerDB,
  rankUpdate,
  rank,
  rankOffset,
  updatedTime
) => {
  try {
    const response = await playerDB.updateOne(
      {
        rankUpdate: rankUpdate,
        rank: rank,
        rankOffset: rankOffset,
        updateTime: updatedTime,
      },
      { runValidators: true }
    );
    return response;
  } catch (err) {
    console.log(err);
  }
};

/**
 * Create a new DB player from API data
 * @param {league} - Ranked system league
 * @param {time} - Update timestamp
 * @returns new Player
 */
const deletePlayers = async (league, region, time) => {
  const model = pickModel(league);
  try {
    const deletion = await model.deleteMany({
      updateTime: { $lt: time },
      region: region,
    });
    return deletion;
  } catch (err) {
    console.log(err);
  }
};
module.exports = {
  getLeaderboardPlayers,
  pickModel,
  findPlayer,
  updateLeaderboardPlayer,
  createPlayer,
  deletePlayers,
};
