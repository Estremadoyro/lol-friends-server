const axios = require("axios");
const { pSummoner } = require("./parseAPI");

const getPlayerAPI = async (region, summoner) => {
  const parameters = pSummoner(region, summoner);
  try {
    const request = await axios.get(parameters);
    const data = request.data;
    if (data) {
      console.log(`Player ${summoner} (${region}) found in API`);
      return data;
    } else {
      console.log(`Player ${summoner} (${region}) NOT found in API`);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getPlayerAPI };
