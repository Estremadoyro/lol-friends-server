const mongoose = require("mongoose");
const { pickModel } = require("../functions/dbQueries");
const db = require("../db");
//Create new player in DB
db();
const createPlayer = async (rank) => {
  const Model = pickModel(rank);
  const player = new Model({
    rankOffset: 0,
    queueRank: "MASTER",
    rankUpdate: "new",
    rank: 206,
    region: "la1",
    summonerId: "100",
    summonerName: "100",
    leaguePoints: 100,
    queue: "RANKED_SOLO_5x5",
    wins: 100,
    losses: 100,
    updateTime: "100",
  });

  try {
    const newPlayer = await player.save();
    console.log(`New player: ${newPlayer}`);
  } catch (err) {
    console.log(err);
    return;
  }
};

const findPlayer = async (rank, summonerId) => {
  const Model = pickModel(rank);
  try {
    const player = await Model.findOne({ summonerId: summonerId });
    console.log(player);
    return player;
  } catch (err) {
    console.log(err);
  }
};

findPlayer("MASTER", "ltLtO73CiNP9hKmtv4Gbpl8S-GNLK56BqBe-3f8zJkFFxQ");
