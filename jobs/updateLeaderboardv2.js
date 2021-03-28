const db = require("../db");
const axios = require("axios");
const mongoose = require("mongoose");

const { plb } = require("../functions/parseAPI");
const {
  findPlayer,
  updateLeaderboardPlayer,
  createPlayer,
  deletePlayers,
} = require("../functions/dbQueries");

const { computeRankStatus } = require("../functions/misc");

db();
const leaderboard = {
  region: "la2",
  queue: "RANKED_SOLO_5x5",
  league: "MASTER",
  division: "I",
};

const updateLeaderboard = async (leaderboard) => {
  // const updatedTime = Date.now().toString();
  const playersAPI = await getPlayersAPI(leaderboard);
  const updateTime = await comparePlayers(leaderboard, playersAPI);
  const rm = await removeDemotedPlayers(leaderboard, updateTime);
  return rm;
};

const getPlayersAPI = async (lb) => {
  const parameters = plb(lb.region, lb.queue, lb.league, lb.division);
  try {
    const request = await axios.get(parameters);
    const players = request.data;
    return players;
  } catch (err) {
    console.log(err);
  }
};

const comparePlayers = async (lb, playersAPI) => {
  const time = Date.now().toString();
  await playersAPI.forEach(async (playerAPI, index) => {
    const newRank = index + 1;
    try {
      const playerDB = await findPlayer(lb.league, playerAPI.summonerId);
      await verifyPlayer(playerDB, playerAPI, lb, time, newRank);
    } catch (err) {
      console.log(err);
    }
  });
  return time;
};

const verifyPlayer = async (playerDB, playerAPI, lb, time, newRank) => {
  try {
    if (playerDB) {
      await updatePlayerDB(playerDB, playerAPI, time, newRank);
    } else {
      await createPlayerDB(playerAPI, lb, newRank, time);
    }
  } catch (err) {
    console.log(err);
  }
};

const updatePlayerDB = async (playerDB, playerAPI, time, newRank) => {
  const rankUpdate = computeRankStatus(playerDB, newRank);
  const rankOffset = playerDB.rank - newRank;
  console.log(`Player ${playerDB.summonerName} status: ${rankUpdate}`);
  console.log(`update: ${rankOffset}`);
  console.log(`new rank ${newRank}`);
  try {
    const update = await updateLeaderboardPlayer(
      playerDB,
      playerAPI,
      rankUpdate,
      newRank,
      rankOffset,
      time
    );
    if (update)
      console.log(`Player ${playerDB.summonerName} updated @ ${time}`);
  } catch (err) {
    console.log(err);
  }
};

const createPlayerDB = async (playerAPI, lb, newRank, time) => {
  try {
    const player = await createPlayer(
      playerAPI,
      lb.league,
      lb.region,
      newRank,
      time
    );

    if (player) console.log(`Player ${player.summonerName} created...`);
  } catch (err) {
    console.log(err);
  }
};

const removeDemotedPlayers = async (lb, time) => {
  try {
    const deletion = await deletePlayers(lb.league, lb.region, time);
    console.log(`Deleted ${deletion.n} from ${lb.region}`);
    // console.log(`Delete time ${time}`);
    return deletion;
  } catch (err) {
    console.log(err);
  }
};
updateLeaderboard(leaderboard);
