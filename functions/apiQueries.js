const axios = require("axios");
const { pSummoner, pSummonerMasteryChampions } = require("./parseAPI");

const getPlayerAPI = async (region, summoner) => {
  const parameters = pSummoner(region, summoner);
  try {
    const { data } = await axios.get(parameters);
    if (data) {
      console.log(`Player ${summoner} (${region}) found in API`);
      return data;
    } else {
      console.log(`Player ${summoner} (${region}) NOT found in API`);
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status == 404) {
        console.log(`Player ${summoner} (${region}) NOT found in API`);
        return;
      }
    }
    console.log(error);
  }
};

const getPlayerMasteryChampions = async (region, summonerId) => {
  const parameters = pSummonerMasteryChampions(region, summonerId);
  try {
    const { data } = await axios.get(parameters);
    return data;
  } catch (error) {
    if (error.response) {
      if (error.response.status == 400) {
        console.log(`SummonerId (${summonerId}) not found @ ${region}`);
        return;
      }
    }
    console.log(error);
  }
};

module.exports = { getPlayerAPI, getPlayerMasteryChampions };
