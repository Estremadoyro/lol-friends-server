const { regionsValue } = require("../functions/misc");

const isRegionAndSummoner = (req, res, next) => {
  const { region, summoner } = req.params;
  if (!region || !summoner)
    return res
      .status(400)
      .json({ error: "Summoner or region cannot be empty" });
  if (
    region.length < 2 ||
    region.length > 4 ||
    !regionsValue.includes(region)
  ) {
    console.log(`Invalid region ${region}`);
    return res.status(400).json({ error: "Invalid region" });
  }
  if (summoner.length < 3 || summoner.length > 16) {
    console.log(`Invalid summoner: ${summoner}`);
    return res.status(400).json({ error: "Invalid summoner name" });
  }
  next();
};

module.exports = { isRegionAndSummoner };
