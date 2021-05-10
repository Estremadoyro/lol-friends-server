const selectRegion = {
  regions: [
    {
      name: "LAS",
      value: "la2",
    },
    {
      name: "LAN",
      value: "la1",
    },
    {
      name: "NA",
      value: "na1",
    },
    {
      name: "BRASIL",
      value: "br1",
    },
    {
      name: "EUW",
      value: "euw1",
    },
    {
      name: "EUNE",
      value: "eun1",
    },
    {
      name: "RUSSIA",
      value: "ru",
    },
    {
      name: "TURKEY",
      value: "tr1",
    },
    {
      name: "JAPAN",
      value: "jp1",
    },
    {
      name: "KOREA",
      value: "kr",
    },
    {
      name: "OCE",
      value: "oc1",
    },
  ],
};

const selectLeague = {
  leagues: [
    {
      name: "CHALLENGER",
      value: "CHALLENGER",
    },
    {
      name: "GRANDMASTER",
      value: "GRANDMASTER",
    },
    {
      name: "MASTER",
      value: "MASTER",
    },
  ],
};

const rankedDivision = {
  divisions: [
    {
      name: "I",
      nameInt: 1,
    },
    {
      name: "II",
      nameInt: 2,
    },
    {
      name: "III",
      nameInt: 3,
    },
    {
      name: "IV",
      nameInt: 4,
    },
  ],
};

const rankedLeague = {
  IRON: {
    name: "Iron",
    division: true,
    weight: 10,
  },
  BRONZE: {
    name: "Bronze",
    division: true,
    weight: 20,
  },
  SILVER: {
    name: "Silver",
    division: true,
    weight: 30,
  },
  GOLD: {
    name: "Gold",
    division: true,
    weight: 40,
  },
  PLATINUM: {
    name: "Platinum",
    division: true,
    weight: 50,
  },
  DIAMOND: {
    name: "Diamond",
    division: true,
    weight: 60,
  },
  MASTER: {
    name: "Master",
    division: false,
    weight: 70,
  },
  GRANDMASTER: {
    name: "Grandmaster",
    division: false,
    weight: 80,
  },
  CHALLENGER: {
    name: "Challenger",
    division: false,
    weight: 90,
  },
};

module.exports = { selectRegion, selectLeague, rankedDivision, rankedLeague };
