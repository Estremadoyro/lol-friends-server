const db = require("../db");
const axios = require("axios");

const { plb } = require("../functions/parseAPI");
const {
  findPlayer,
  updateLeaderboardPlayer,
  createLeaderboardPlayer,
  deletePlayers,
} = require("../functions/dbQueries");

const { selectLeague } = require("../misc/Variables");
const { selectRegion } = require("../misc/Variables");

const { computeRankStatus } = require("../functions/misc");

db();
const leaderboard = {
  region: "",
  queue: "RANKED_SOLO_5x5",
  league: "",
  division: "I",
};

const updateLeaderboard = async (leaderboard) => {
  for (var i = 0; i < selectLeague.leagues.length; i++) {
    leaderboard.league = selectLeague.leagues[i].name;
    for (var j = 0; j < selectRegion.regions.length; j++) {
      leaderboard.region = selectRegion.regions[j].value;
      const playersAPI = await getPlayersAPI(leaderboard);
      const updateTime = await comparePlayers(leaderboard, playersAPI);
      await removeDemotedPlayers(leaderboard, updateTime);
    }
  }
  console.log(`Finished all updates`);
  return;
};

const getPlayersAPI = async (lb) => {
  const parameters = plb(lb.region, lb.queue, lb.league, lb.division);
  try {
    //Get Riot API
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
    const player = await createLeaderboardPlayer(
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
    console.log(`Deleted ${deletion.n} from ${lb.region} | ${lb.league}`);
    // console.log(`Delete time ${time}`);
    return deletion;
  } catch (err) {
    console.log(err);
  }
};

updateLeaderboard(leaderboard);
