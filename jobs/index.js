const cron = require("node-cron");
const db = require("../db");
const mongoose = require("mongoose");
const axios = require("axios").default;
const { plb } = require("../functions/parseAPI");
const { selectRegion } = require("../misc/Variables");
const { pickModel } = require("../functions/dbQueries");

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
  await updateLeaderBoard(regions[1].value, queue, rank, division);
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
    await comparePlayers(res, region, model);
  } catch (err) {
    console.log(err);
  }
  console.log(`Finished: ${region}`);
  return;
  // cron.schedule("*/1 * * * *", updateLeaderBoard);
};

/**
 * player - RIOT's API player
 * rankedPlayer - DB's player
 */
const comparePlayers = async (res, region, model) => {
  await deletePlayers(res.data, model);
  //Player from RIOT's API
  res.data.forEach(async (player, index) => {
    const rank = index + 1;
    const rankedPlayer = await model.findOne({
      summonerId: player.summonerId,
    });

    if (rankedPlayer) updatePlayer(rankedPlayer, rank, player, model);
    else createPlayer(player, rank, region, model);
  });
};
//Delete when player descent from API's leaderboard
const deletePlayers = async (apiPlayers, model) => {
  try {
    const dbPlayers = await model.find();
    for (var i = 0; i < dbPlayers.length; i++) {
      for (var j = 0; j < apiPlayers.length; j++) {
        if (dbPlayers[i].summonerId == apiPlayers[j].summonerId) {
          return;
        }
      }
      console.log(`Player to delete: ${dbPlayers[i].summonerName}`);
      await model.deleteOne({ summonerId: dbPlayers[i].summonerId });
    }
  } catch (err) {
    console.log(err);
  }
};
const updatePlayer = async (rankedPlayer, rank, player, model) => {
  console.log("Player found", rankedPlayer);
  const rankUpdate = computeRankStatus(rankedPlayer, player);
  const rankOffset = rank - rankedPlayer.rank;
  try {
    await model.updateOne(
      { summonerId: rankedPlayer.summonerId },
      {
        rankUpdate: rankUpdate,
        rank: rank,
        rankOffset: rankOffset,
        leaguePoints: player.leaguePoints,
        wins: player.wins,
        losses: player.losses,
      }
      // { runValidators: true },
      // { upsert: false }
    );
  } catch (err) {
    console.log(err);
  }
};

const createPlayer = async (player, rank, region, model) => {
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
  });
  console.log("Player created", newPlayer);
  const createRankedPlayer = await newPlayer.save();
  return createRankedPlayer;
};
