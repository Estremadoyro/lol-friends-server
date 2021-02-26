const mongoose = require('mongoose');

const RankChallengerSchema = new mongoose.Schema({
  rank: {
    type: Number,
    required: true,
  },
  queueRank: {
    type: String,
    enum: ['Challenger', 'Grandmaster', 'Master'],
    default: 'Challenger',
    required: true,
  },
  summonerName: {
    type: String,
    min: 3,
    max: 16,
    required: true,
  },
  leaguePoints: {
    type: Number,
    required: true,
  },
  queue: {
    type: String,
    required: true,
  },
  wins: {
    type: Number,
    required: true,
  },
  losses: {
    type: Number,
    required: true,
  },
  rankUpdate: {
    type: String,
    enum: ['up', 'down', 'same'],
    default: 'same',
    required: true,
  }
});

module.exports = mongoose.model('RANK_LEADERBOARD_CHALLENGER', RankChallengerSchema);
