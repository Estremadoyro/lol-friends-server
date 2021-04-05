const axios = require("axios");
const { pSummoner } = require("./parseAPI");

const getPlayerAPI = async (region, summoner) => {
  const parameters = pSummoner(region, summoner);
  try {
    const { data } = await axios.get(parameters);
    if (data) {
      console.log(`Player ${summoner} (${region}) found in API`);
    } else {
      console.log(`Player ${summoner} (${region}) NOT found in API`);
    }
    return data;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getPlayerAPI };
