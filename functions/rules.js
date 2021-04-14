const { selectLeague } = require("../misc/Variables");

const checkLeague = (league) => {
  const leagues = selectLeague.leagues.map((league) => league.name);
  return leagues.includes(league);
};

module.exports = { checkLeague };
