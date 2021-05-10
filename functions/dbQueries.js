const RankChallenger = require("../models/rank-challenger");
const RankGrandMaster = require("../models/rank-grandmaster");
const RankMaster = require("../models/rank-master");

const Summoner = require("../models/summoner");
const SummonerMastery = require("../models/summoner-mastery");
const summonerRank = require("../models/summoner-rank");
const SummonerRank = require("../models/summoner-rank");

const {
  getHighestLeagueDivision,
  getParsedLeagueDivision,
  computeWinrate,
  getParsedQueue,
} = require("../functions/misc");

const {
  getPlayerMasteryChampionsAPI,
  getPlayerRanksAPI,
} = require("./apiQueries");
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
const createLeaderboardPlayer = async (
  playerAPI,
  league,
  region,
  rank,
  updatedTime
) => {
  const model = pickModel(league);
  const newPlayer = new model({
    rank: rank,
    region: region,
    summonerId: playerAPI.summonerId,
    league: playerAPI.tier,
    summonerName: playerAPI.summonerName,
    leaguePoints: playerAPI.leaguePoints,
    veteran: playerAPI.veteran,
    inactive: playerAPI.inactive,
    freshBlood: playerAPI.freshBlood,
    hotSreak: playerAPI.hotSreak,
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
        summonerName: playerAPI.summonerName,
        veteran: playerAPI.veteran,
        inactive: playerAPI.inactive,
        freshBlood: playerAPI.freshBlood,
        hotSreak: playerAPI.hotSreak,
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
      nameLower: summoner.toLowerCase().trim().replace(/\s+/g, ""),
      region: region,
    })
      .populate("championMastery")
      .populate("summonerRank");
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

const createPlayerRanksDB = async (region, p) => {
  try {
    const playerRanks = await getPlayerRanksAPI(region, p.id);
    const playerRanksSoloFlex = [];
    let playerIsRankedSoloAndFlex = [];
    let highestLeague = "";
    const queues = ["RANKED_SOLO_5x5", "RANKED_FLEX_SR"];
    console.log(`Ranks length: ${playerRanks.length}`);
    if (playerRanks.length < 1 || playerRanks.length == 2) {
      if (playerRanks.length < 1) {
        queues.forEach((queue) => {
          const newPlayerUnranked = new SummonerRank({
            summonerId: p.id,
            summonerName: p.name,
            queueType: queue,
            queue: getParsedQueue(queue),
            region: region,
            leagueDivision: "Unranked",
          });
          playerRanksSoloFlex.push(newPlayerUnranked);
        });
        playerIsRankedSoloAndFlex = [false, false];
        highestLeague = "Unranked";
      } else if (playerRanks.length == 2) {
        playerRanks.forEach((queue) => {
          const newLeagueDivision = {
            league: queue.tier,
            division: queue.rank,
          };
          const fullLeague = getParsedLeagueDivision(newLeagueDivision);
          const newPlayerSoloAndFlex = new SummonerRank({
            leagueId: queue.leagueId,
            queueType: queue.queueType,
            queue: getParsedQueue(queue.queueType),
            league: queue.tier.toLowerCase(),
            division: queue.rank,
            leagueDivision: fullLeague,
            isRanked: true,
            summonerId: p.id,
            summonerName: p.name,
            leaguePoints: queue.leaguePoints,
            wins: queue.wins,
            losses: queue.losses,
            winRate: computeWinrate(queue.wins, queue.losses),
            veteran: queue.veteran,
            inactive: queue.inactive,
            freshBlood: queue.freshBlood,
            hotStreak: queue.hotStreak,
            region: region,
          });
          if (newPlayerSoloAndFlex.queue == "Solo") {
            playerRanksSoloFlex.unshift(newPlayerSoloAndFlex);
          } else {
            playerRanksSoloFlex.push(newPlayerSoloAndFlex);
          }
        });
        playerIsRankedSoloAndFlex = [true, true];
        const newLeagueDivision1 = {
          league: playerRanks[0].tier,
          division: playerRanks[0].rank,
        };
        const newLeagueDivision2 = {
          league: playerRanks[1].tier,
          division: playerRanks[1].rank,
        };
        const computeHighestLeague = getHighestLeagueDivision(
          newLeagueDivision1,
          newLeagueDivision2
        );
        highestLeague = computeHighestLeague.league;
      }
    } else if (playerRanks.length == 1) {
      if (playerRanks[0].queueType === "RANKED_SOLO_5x5") {
        const newLeagueDivision = {
          league: playerRanks[0].tier,
          division: playerRanks[0].rank,
        };
        const fullLeague = getParsedLeagueDivision(newLeagueDivision);
        const newPlayerSolo = new SummonerRank({
          leagueId: playerRanks[0].leagueId,
          queueType: playerRanks[0].queueType,
          queue: getParsedQueue(playerRanks[0].queueType),
          league: playerRanks[0].tier.toLowerCase(),
          division: playerRanks[0].rank,
          leagueDivision: fullLeague,
          isRanked: true,
          summonerId: playerRanks[0].summonerId,
          summonerName: playerRanks[0].summonerName,
          leaguePoints: playerRanks[0].leaguePoints,
          wins: playerRanks[0].wins,
          losses: playerRanks[0].losses,
          winRate: computeWinrate(playerRanks[0].wins, playerRanks[0].losses),
          veteran: playerRanks[0].veteran,
          inactive: playerRanks[0].inactive,
          freshBlood: playerRanks[0].freshBlood,
          hotStreak: playerRanks[0].hotStreak,
          region: region,
        });
        const newPlayerFlex = new SummonerRank({
          summonerId: p.id,
          summonerName: p.name,
          region: region,
          queueType: queues[1],
          queue: getParsedQueue(queues[1]),
        });
        playerRanksSoloFlex.push(newPlayerSolo, newPlayerFlex);
        playerIsRankedSoloAndFlex = [true, false];
        highestLeague = playerRanks[0].tier;
      } else if (playerRanks[0].queueType === "RANKED_FLEX_SR") {
        const newLeagueDivision = {
          league: playerRanks[0].tier,
          division: playerRanks[0].rank,
        };
        const fullLeague = getParsedLeagueDivision(newLeagueDivision);
        const newPlayerFlex = new summonerRank({
          leagueId: playerRanks[0].leagueId,
          queueType: playerRanks[0].queueType,
          queue: getParsedQueue(playerRanks[0].queueType),
          league: playerRanks[0].tier.toLowerCase(),
          division: playerRanks[0].rank,
          leagueDivision: fullLeague,
          isRanked: true,
          summonerId: playerRanks[0].summonerId,
          summonerName: playerRanks[0].summonerName,
          leaguePoints: playerRanks[0].leaguePoints,
          wins: playerRanks[0].wins,
          losses: playerRanks[0].losses,
          winRate: computeWinrate(playerRanks[0].wins, playerRanks[0].losses),
          veteran: playerRanks[0].veteran,
          inactive: playerRanks[0].inactive,
          freshBlood: playerRanks[0].freshBlood,
          hotStreak: playerRanks[0].hotStreak,
          region: region,
        });
        const newPlayerSolo = new SummonerRank({
          summonerId: p.id,
          summonerName: p.name,
          queueType: queues[0],
          queue: getParsedQueue(queues[0]),
          region: region,
        });
        playerRanksSoloFlex.push(newPlayerSolo, newPlayerFlex);
        playerIsRankedSoloAndFlex = [false, true];
        highestLeague = playerRanks[0].tier;
      }
    }
    playerRanksSoloFlex.forEach(async (playerRank) => {
      await playerRank.save();
    });
    console.log(playerRanksSoloFlex);
    return { playerRanksSoloFlex, playerIsRankedSoloAndFlex, highestLeague };
  } catch (error) {
    console.log(error);
  }
};

const createPlayerMasteriesDB = async (region, p) => {
  try {
    const playerMastery = await getPlayerMasteryChampionsAPI(region, p.id);
    const playerMastery10 = playerMastery.slice(0, 10);
    const championMasteries = [];
    playerMastery10.map(async (mastery) => {
      const championMastery = new SummonerMastery({
        chestGranted: mastery.chestGranted,
        tokensEarned: mastery.tokensEarned,
        championId: mastery.championId,
        championLevel: mastery.championLevel,
        championIconUrl: `https://cdn.communitydragon.org/11.9.9/champion/${mastery.championId}/square`,
        championPoints: mastery.championPoints,
        lastPlayTime: mastery.lastPlayTime,
        championPointsSinceLastLevel: mastery.championPointsSinceLastLevel,
        championPointsUntilNextLevel: mastery.championPointsUntilNextLevel,
        summonerId: mastery.summonerId,
      });
      championMasteries.push(championMastery);
      await championMastery.save();
    });
    return championMasteries;
  } catch (err) {
    console.log(err);
  }
};

const createPlayerDB = async (p, region) => {
  try {
    const playerExists = await getPlayerDB(region, p.name);
    if (playerExists) {
      console.log(`Player ${p.name} already exists @ ${region}`);
      return;
    }
    const newPlayer = new Summoner({
      id: p.id,
      accountId: p.accountId,
      puuid: p.puuid,
      region: region,
      name: p.name,
      nameLower: p.name.toLowerCase().replace(/\s+/g, ""),
      profileIconId: p.profileIconId,
      profileIconUrl: `https://ddragon.leagueoflegends.com/cdn/11.9.1/img/profileicon/${p.profileIconId}.png`,
      summonerLevel: p.summonerLevel,
    });
    const championMastery = await createPlayerMasteriesDB(region, p);
    const summonerRank = await createPlayerRanksDB(region, p);
    newPlayer.championMastery = championMastery;
    newPlayer.summonerRank = summonerRank.playerRanksSoloFlex;
    newPlayer.isRankedSolo = summonerRank.playerIsRankedSoloAndFlex[0];
    newPlayer.isRankedFlex = summonerRank.playerIsRankedSoloAndFlex[1];
    if (newPlayer.isRankedSolo && newPlayer.isRankedFlex) {
      newPlayer.isRanked = true;
    }
    newPlayer.highestLeague = summonerRank.highestLeague.toLowerCase();
    console.log(`RANKED INFO`);
    console.log(summonerRank.playerRanksSoloFlex);
    const resp = await newPlayer.save();
    console.log(resp);
    if (resp) console.log(`Player ${resp.name} (${resp.region}) created in DB`);
    return resp;
  } catch (err) {
    if (err.code === 11000) {
      console.log(`Summoner ${p.name} already exists @ ${region}`);
      return;
    }
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
  createLeaderboardPlayer,
  deletePlayers,
};
