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
  region: "la1",
  queue: "RANKED_SOLO_5x5",
  league: "CHALLENGER",
  division: "I",
};

const updateLeaderboard = async (leaderboard) => {
  const updatedTime = Date.now().toString();
  const playersAPI = await getPlayersAPI(leaderboard);
  await comparePlayers(leaderboard, playersAPI, updatedTime);
  await removeDemotedPlayers(leaderboard, updatedTime);
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

const comparePlayers = async (lb, playersAPI, time) => {
  playersAPI.forEach(async (playerAPI, index) => {
    const newRank = index + 1;
    try {
      const playerDB = await findPlayer(lb.league, playerAPI.summonerId);
      const compare = await verifyPlayer(
        playerDB,
        playerAPI,
        lb,
        time,
        newRank
      );
    } catch (err) {
      console.log(err);
    }
  });
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
  const rankUpdate = computeRankStatus(playerDB, playerAPI);
  const rankOffset = newRank - playerDB.rank;
  try {
    const update = await updateLeaderboardPlayer(
      playerDB,
      rankUpdate,
      newRank,
      rankOffset,
      time
    );
    if (update) console.log(`Player ${playerDB.summonerName} updated ...`);
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
    return deletion;
  } catch (err) {
    console.log(err);
  }
};
updateLeaderboard(leaderboard);
