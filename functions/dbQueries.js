const RankChallenger = require("../models/rank-challenger");
const RankGrandMaster = require("../models/rank-grandmaster");
const RankMaster = require("../models/rank-master");

const Summoner = require("../models/summoner");

// const dayjs = require("dayjs");
// const relativeTime = require("dayjs/plugin/relativeTime");
// dayjs.extend(relativeTime);
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
  console.log(`League: ${league}, region: ${region}, queue: ${queue} `);
  try {
    const players = await model
      .find({
        region: region,
      })
      .sort({ rank: 1 });
    console.log(players.length);
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
  playerAPI,
  rankUpdate,
  rank,
  rankOffset,
  updatedTime
) => {
  try {
    const response = await playerDB.updateOne(
      {
        rankUpdate: rankUpdate,
        wins: playerAPI.wins,
        losses: playerAPI.losses,
        leaguePoints: playerAPI.leaguePoints,
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
  console.log(`Process delete time ${time}`);
  const model = pickModel(league);
  try {
    const findPlayers = await model.find();
    findPlayers.forEach((player) => {
      console.log(`DB player time ${player.updateTime}`);
    });
    const deletion = await model.deleteMany({
      updateTime: { $ne: time },
      region: region,
    });
    return deletion;
  } catch (err) {
    console.log(err);
  }
};

const getPlayerDB = async (region, summoner) => {
  try {
    const player = await Summoner.findOne({
      // name: new RegExp(`\\b${summoner}\\b`, "i"),
      nameLower: summoner.toLowerCase().trim().replace(/\s+/g, ""),
      region: region,
    });
    if (player) {
      console.log(`Player ${summoner} (${region}) found in DB`);
      return player;
    } else {
      console.log(`Player ${summoner} (${region}) NOT found in DB`);
    }
  } catch (err) {
    console.log(err);
  }
};

const createPlayerDB = async (p) => {
  try {
    const newPlayer = new Summoner({
      id: p.id,
      accountId: p.accountId,
      puuid: p.puuid,
      region: p.region,
      name: p.name,
      nameLower: p.name.toLowerCase().replace(/\s+/g, ""),
      profileIconId: p.profileIconId,
      profileIconUrl: `https://cdn.communitydragon.org/11.7.9/profile-icon/${p.profileIconId}`,
      summonerLevel: p.summonerLevel,
    });
    const resp = await newPlayer.save();
    if (resp) console.log(`Player ${resp.name} (${resp.region}) created in DB`);
    return resp;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getLeaderboardPlayers,
  getPlayerDB,
  createPlayerDB,
  pickModel,
  findPlayer,
  updateLeaderboardPlayer,
  createPlayer,
  deletePlayers,
};
