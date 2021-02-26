const cron = require('node-cron');
const db = require('../db');
const axios = require('axios').default;
require('dotenv').config();
const { plb } = require('../functions/parseAPI');

const RankChallenger = require('../models/rank-challenger');

/**
 * @param {User} - before
 * @param {User} - now
 *
 * @returns 'up' | 'down' | 'same'
*/
const computeRankStatus = (before, now) => {
  if (!before.rank) return 'same';
  if (now.rank > before.rank) return 'up';
  else if (now.rank < before.rank) return 'down';
  else return 'same';
};

(() => {
  db();

  const batchDB = async () => {
    const url = plb('la2', 'RANKED_SOLO_5x5', 'CHALLENGER', 1);
    try {
      const res = await axios.get(url);
      
      res.data.forEach(async (player, index) => {
        const rank = index + 1;
        const user = await RankChallenger.findOne({ summonerId: player.summonerId });
        if (!user) {
          console.log('Not found user, creating...');
          const newUser = RankChallenger({
            rank: rank,
            summonerId: player.summonerId,
            queueRank: player.tier,
            summonerName: player.summonerName,
            leaguePoints: player.leaguePoints,
            queue: player.queueType,
            wins: player.wins,
            losses: player.losses,
            rankUpdate: 'new',
          })
          console.log('User created', newUser);
          await newUser.save();
        } else {
          console.log('User found', user);
          const rankUpdate = computeRankStatus(user, player);
          const rankOffset = rank - user.rank;
          await user.update(
            { rankUpdate:  rankUpdate, rank: rank, rankOffset: rankOffset},
            { runValidators: true }
          );
        }
      })
    } catch (err) {
      console.error(err);
    }
    console.log('Finishing...');
  };

  cron.schedule('*/30 * * * *', batchDB);
})();
