const cron = require("node-cron");
const db = require("../db");
const axios = require("axios").default;
require("dotenv").config();
const { plb } = require("../functions/parseAPI");

const RankChallenger = require("../models/rank-challenger");
const RankMaster = require("../models/rank-master");
const RankGrandmaster = require("../models/rank-grandmaster");
const { pickModel } = require("../functions/dbQueries");
/**
 * @param {User} - before
 * @param {User} - now
 *
 * @returns 'up' | 'down' | 'same'
 */
const computeRankStatus = (before, now) => {
  if (!before.rank) return "same";
  if (now.rank > before.rank) return "up";
  else if (now.rank < before.rank) return "down";
  else return "same";
};

(() => {
  db();

  const batchDB = async (region, model, rankTag) => {
    const updatedTime = Date.now().toString();
    const url = plb(region, "RANKED_SOLO_5x5", rankTag, "I");
    try {
      const res = await axios.get(url);

      res.data.forEach(async (player, index) => {
        const rank = index + 1;
        const user = await model.findOne({
          summonerId: player.summonerId,
        });
        if (!user) {
          console.log("Not found user, creating...");
          const newUser = model({
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
            updateTime: updatedTime,
          });
          console.log("User created", newUser);
          await newUser.save();
        } else {
          console.log("User found", user);
          const rankUpdate = computeRankStatus(user, player);
          const rankOffset = rank - user.rank;
          await user.update(
            {
              rankUpdate: rankUpdate,
              rank: rank,
              rankOffset: rankOffset,
              updateTime: updatedTime,
            },
            { runValidators: true }
          );
        }
      });
      return updatedTime;
    } catch (err) {
      console.error(err);
    }
    console.log("Finishing...");
  };

  const job = () => {
    const rankTag = "MASTER";
    const model = pickModel(rankTag);
    const regions = [
      "la1",
      "la2",
      "na1",
      "br1",
      "euw1",
      "eun1",
      "ru",
      "tr1",
      "jp1",
    ];
    /**
     * la1  1000 64 registros
     * la2  2000 50 registros -> delete
     * na1  3000 80 registros -> delete
     */
    regions.forEach((region) => {
      batchDB(region, model, rankTag).then((time) => {
        setTimeout(() => {
          console.log("Deleting Region", region);
          model
            .deleteMany({
              updateTime: { $lt: time },
              region: region,
            })
            .then((players) => console.log(players));
        }, 8000);
      });
    });
  };
  job();
  // cron.schedule('*/30 * * * *', job);
})();
