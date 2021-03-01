const cron = require("node-cron");
const db = require("../db");
const mongoose = require("mongoose");
const axios = require("axios").default;
const { plb } = require("../functions/parseAPI");
const { selectRegion } = require("../misc/Variables");
const { pickModel, findPlayer } = require("../functions/dbQueries");
const RankMaster = require('../models/rank-master');

// require("dotenv").config();
/**
 * @param {User} - before
 * @param {User} - now
 *
 * @returns 'up' | 'down' | 'same'
 */
db();
const db_connection = mongoose.connection;
const db_connected = () => {
  db_connection.once("open", () => {
    handleUpdates(selectRegion.regions, "RANKED_SOLO_5x5", "MASTER", "I");
  });
  return;
};
db_connected();

const handleUpdates = async (regions, queue, rank, division) => {
  // await updateLeaderBoard(regions[0].value, queue, rank, division);
  const updatedTime = await updateLeaderBoard(regions[1].value, queue, rank, division);
  console.log('DELETING ALL PLAYERS GAAA');
  console.log(updatedTime, 'updated time');
  await deletePlayers(updatedTime, RankMaster);
  // await updateLeaderBoard(regions[2].value, queue, rank, division);
  // await updateLeaderBoard(regions[3].value, queue, rank, division);
  // await updateLeaderBoard(regions[4].value, queue, rank, division);
  // await updateLeaderBoard(regions[5].value, queue, rank, division);
  // await updateLeaderBoard(regions[6].value, queue, rank, division);
  // await updateLeaderBoard(regions[7].value, queue, rank, division);
  // await updateLeaderBoard(regions[8].value, queue, rank, division);
};

const computeRankStatus = (before, now) => {
  if (!before.rank) return "same";
  if (now.rank > before.rank) return "up";
  else if (now.rank < before.rank) return "down";
  else return "same";
};

const updateLeaderBoard = async (region, queue, rank, division) => {
  const api = plb(region, queue, rank, division);
  try {
    const res = await axios.get(api);
    const model = pickModel(rank);
    const updatedTime = await comparePlayers(res, region, model, rank)
    return updatedTime;
  } catch (err) {
    console.log(err);
  }
  console.log(`Finished: ${region}`);
  // cron.schedule("*/1 * * * *", updateLeaderBoard);
};

/**
 * player - RIOT's API player
 * rankedPlayer - DB's player
 */
const comparePlayers = async (res, region, model, leaderboardRank) => {
  const updateTime = String(generateTimestamp());

  //Player from RIOT's API
  await res.data.forEach(async (player, index) => {
    // const rankedPlayer = await model.findOne({
    //   summonerId: player.summonerId,
    // });
    try {
      const rank = index + 1;
      const rankedPlayer = await findPlayer(rank, player.summonerId);
      // console.log(rankedPlayer);
      if (rankedPlayer) {
        console.log('Update player');
        await updatePlayer(rankedPlayer, rank, player, model, updateTime);
      } else {
        console.log('Create new Player');
        await createPlayer(player, rank, region, model, updateTime);
      }
    } catch (err) {
      console.log(err);
    }
  });

  return updateTime;

};

const generateTimestamp = () => {
  return Date.now();
};

//Delete when player descent from API's leaderboard
const deletePlayers = async (updatedTime, model) => {
  console.log(updatedTime, 'Update Time')
  try {
    const deletedPlayers = await model.deleteMany({
      updateTime: { $lt: updatedTime }
    });
    console.log(deletedPlayers);
  } catch (err) {
    console.error(err);
  }
};

/**
 * @param {Player} rankedPlayer
 * @param {number} rank - Puesto del jugador
 * @param {Player} player - Player del API
*/
const updatePlayer = async (rankedPlayer, rank, player, model, updateTime) => {
  const rankUpdate = computeRankStatus(rankedPlayer, player);
  const rankOffset = rank - rankedPlayer.rank;
  try {
    console.log('Rank player found... updating', rankedPlayer.summonerName);
    const updatedPlayer = await model.findOneAndUpdate(
      { summonerId: rankedPlayer.summonerId },
      {
        rankUpdate: rankUpdate,
        rank: rank,
        rankOffset: rankOffset,
        leaguePoints: player.leaguePoints,
        wins: player.wins,
        losses: player.losses,
        updateTime: updateTime,
      },
      { new: true }
      // { runValidators: true },
      // { upsert: false }
    );
    console.log('updated Player', updatedPlayer);
  } catch (err) {
    console.log(err);
  }
};

const createPlayer = async (player, rank, region, model, updateTime) => {
  console.log(`Player: (${player.summonerName}) not found, creating...`);
  const newPlayer = model({
    rank: rank,
    region: region,
    summonerId: player.summonerId,
    queueRank: player.tier,
    summonerName: player.summonerName,
    leaguePoints: player.leaguePoints,
    queue: player.queueType,
    wins: player.wins,
    losses: player.losses,
    rankUpdate: "new",
    updateTime: updateTime,
  });
  console.log("Player created", newPlayer);
  const createRankedPlayer = await newPlayer.save();
  return createRankedPlayer;
};
